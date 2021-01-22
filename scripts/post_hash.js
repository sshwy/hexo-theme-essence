/* global hexo */

const jsYaml = require('js-yaml');
const crypto = require('crypto');
const fs = require('fs');
const moment = require('moment');
const log = require('hexo-log')({ debug: false, silent: false });
const timezone = hexo.config.timezone || 'Asia/Shanghai';
const language = hexo.config.language || 'en';

function parseFrontMatter(raw){
  const frontMatterMatch = raw.match(/^---\n(.*?)\n---\n/s);
  if (frontMatterMatch === null) return null;
  return jsYaml.load(frontMatterMatch[1] || '', { schema: jsYaml.JSON_SCHEMA });
}
function shaHash(raw){
  let shasum = crypto.createHash('sha1');
  shasum.update(raw);
  return shasum.digest('hex');
}
hexo.extend.filter.register('before_post_render', function (data) {
  const themeCfg = this.theme.config;

  if(themeCfg.historyHash === false || data.historyHash === false) return data;

  const obj = parseFrontMatter(data.raw);
  if(obj === null)return;

  const rawContent = data.raw.replace(/^---\n(.*?)\n---\n/s, ''),
    currentTime = moment().tz(timezone),
    shastr = shaHash(rawContent) + '#' + currentTime.format();

  let flag = true;
  if (!obj.historyHash || obj.historyHash[0].replace(/#.*$/, '') !== shastr.replace(/#.*$/, '')) {
    flag = false;
    if (!obj.historyHash) obj.historyHash = [shastr];
    else obj.historyHash.unshift(shastr);
  }
  const latestTime = moment(obj.historyHash[0].replace(/^.*?#/,'')).tz(timezone);
  if(obj.date !== latestTime.tz(timezone).format()){
    flag = false;
    obj.date = latestTime.tz(timezone).format();
  }
  if(flag) {
    data.date = latestTime.tz(timezone);
    return data;
  }

  const newFrontMatterStr = jsYaml.dump(obj, { indent: 2 });
  const newRaw = data.raw.replace(/^---\n(.*?)\n---\n/s, () => `---\n${newFrontMatterStr}---\n`);

  fs.writeFileSync(data.full_source, newRaw, { encoding: 'utf8' });

  if (data.historyHash) data.historyHash.unshift(shastr);
  else data.historyHash = [shastr];
  data.date = currentTime.tz(timezone);
  data.raw = newRaw;

  return data;
});

function _date(obj, fmt){
  log.info('obj:', moment(obj).format(), 'fmt:', fmt, 'config:', timezone, language, 'result:', 
    moment(obj).tz(timezone).locale(language).format(fmt));
  return moment(obj).tz(timezone).locale(language).format(fmt);
}

hexo.extend.helper.register('lctzDate', _date);

hexo.extend.helper.register('historyParseTime', function (str) {
  // log.info('Final:           ', _date(str.match(/#(.*?)$/)[1] || '', 'LLL z LLLL'));
  return _date(str.match(/#(.*?)$/)[1] || '', 'LL');
});


hexo.extend.helper.register('historyParseHash', function (str) {
  return str.match(/^.{6}/)[0] || 'Null';
});
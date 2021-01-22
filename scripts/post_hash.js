/* global hexo */

const jsYaml = require('js-yaml');
const crypto = require('crypto');
const fs = require('fs');
const moment = require('moment');
const log = require('hexo-log')({
  debug: false,
  silent: false
});

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
  const timezone = this.config.timezone || 'Asia/Shanghai';

  // console.log(data.date.format());
  // console.log(data.date.tz(timezone).format());

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
    // console.log('latestTime', latestTime.format());
    data.date = latestTime.tz(timezone); //format('YYYY-MM-DD HH:mm:ss'));
    return data;
  }

  const newFrontMatterStr = jsYaml.dump(obj, { indent: 2 });
  const newRaw = data.raw.replace(/^---\n(.*?)\n---\n/s, () => `---\n${newFrontMatterStr}---\n`);

  fs.writeFileSync(data.full_source, newRaw, { encoding: 'utf8' });

  if (data.historyHash) data.historyHash.unshift(shastr);
  else data.historyHash = [shastr];
  data.date = currentTime.tz(timezone); //format('YYYY-MM-DD HH:mm:ss'));
  data.raw = newRaw;

  return data;
});

hexo.extend.helper.register('historyParseTime', function (str) {
  const { timezone, language } = this.config;
  const date = moment(str.match(/#(.*?)$/)[1] || '');
  log.info('Origin:          ', date.format()); 
  log.info('Parsed Timezone: ', date.tz(timezone).format()); 
  return date.tz(timezone).locale(language).format('LL');
});

hexo.extend.helper.register('historyParseHash', function (str) {
  return str.match(/^.{6}/)[0] || 'Null';
});
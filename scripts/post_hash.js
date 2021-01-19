/* global hexo */

const jsYaml = require('js-yaml');
const crypto = require('crypto');
const fs = require('fs');
const momentTZ = require('moment-timezone');
const moment = require('moment');

hexo.extend.filter.register('before_post_render', function (data) {
  const { config } = this;
  const themeCfg = this.theme.config;

  const timezone = config.timezone || 'Asia/Shanghai';
  console.log('timezone', timezone);

  if(themeCfg.historyHash === false || data.historyHash === false) return data;
  // User configuration
  let shasum = crypto.createHash('sha1');

  const frontMatterMatch = data.raw.match(/^---\n(.*?)\n---\n/s);

  if (frontMatterMatch === null) return data;

  const frontMatterStr = frontMatterMatch[1];
  const rawContentStr = data.raw.replace(/^---\n(.*?)\n---\n/s, '');

  const obj = jsYaml.load(frontMatterStr, {
    schema: jsYaml.JSON_SCHEMA
  });

  shasum.update(rawContentStr);
  const currentTime = momentTZ().tz(timezone);
  const shastr = shasum.digest('hex') + '#' + currentTime.format();

  let flag = true;
  if (!obj.historyHash || obj.historyHash[0].replace(/#.*$/, '') !== shastr.replace(/#.*$/, '')) {
    flag = false;
    if (!obj.historyHash) obj.historyHash = [shastr];
    else obj.historyHash.unshift(shastr);
  }
  const latestTime = momentTZ(obj.historyHash[0].replace(/^.*?#/,''));
  if(obj.date !== latestTime.tz(timezone).format()){
    flag = false;
    obj.date = latestTime.tz(timezone).format();
  }
  if(flag) {
    console.log('latestTime', latestTime.format());
    data.date = moment(latestTime.format('YYYY-MM-DD HH:mm:ss'));
    return data;
  }

  const newFrontMatterStr = jsYaml.dump(obj, { indent: 2 });

  const newRaw = data.raw.replace(/^---\n(.*?)\n---\n/s, () => `---\n${newFrontMatterStr}---\n`);

  fs.writeFileSync(data.full_source, newRaw, { encoding: 'utf8' });

  if (data.historyHash) data.historyHash.unshift(shastr);
  else data.historyHash = [shastr];
  data.date = moment(currentTime.format('YYYY-MM-DD HH:mm:ss'));

  return data;
});

hexo.extend.helper.register('historyParseTime', function (str) {
  const { timezone, language } = this.config;
  return momentTZ(str.match(/#(.*?)$/)[1] || '').tz(timezone).locale(language).format('LL');
});

hexo.extend.helper.register('historyParseHash', function (str) {
  return str.match(/^.{6}/)[0] || 'Null';
});
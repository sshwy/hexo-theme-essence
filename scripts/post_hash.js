/* global hexo */

const jsYaml = require('js-yaml');
const crypto = require('crypto');
const fs = require('fs');
const moment = require('moment');

hexo.extend.filter.register('before_post_render', function (data) {
  // User configuration
  // const { config } = this;
  // const themeCfg = this.theme.config;
  let shasum = crypto.createHash('sha1');

  const frontMatterMatch = data.raw.match(/^---\n(.*?)\n---\n/s);

  if (frontMatterMatch === null) return data;

  const frontMatterStr = frontMatterMatch[1];
  const rawContentStr = data.raw.replace(/^---\n(.*?)\n---\n/s, '');

  const obj = jsYaml.load(frontMatterStr, {
    schema: jsYaml.JSON_SCHEMA
  });

  shasum.update(rawContentStr);
  const shastr = shasum.digest('hex') + '#' + moment().format();

  let flag = true;
  if (!obj.historyHash || obj.historyHash[0].replace(/#.*$/, '') !== shastr.replace(/#.*$/, '')) {
    flag = false;
    if (!obj.historyHash) obj.historyHash = [shastr];
    else obj.historyHash.unshift(shastr);
  }
  const latestTime = moment(obj.historyHash[0].replace(/^.*?#/,'')).format('YYYY-MM-DD HH:mm:ss');
  if(obj.date !== latestTime){
    flag = false;
    obj.date = latestTime;
  }
  if(flag) {
    data.date = moment(obj.historyHash[0].replace(/^.*?#/,''));
    return data;
  }

  const newFrontMatterStr = jsYaml.dump(obj, { indent: 2 });

  const newRaw = data.raw.replace(/^---\n(.*?)\n---\n/s, () => `---\n${newFrontMatterStr}---\n`);

  fs.writeFileSync(data.full_source, newRaw, { encoding: 'utf8' });

  // console.log(data.full_source);
  // console.log(obj.historyHash);

  if (data.historyHash) data.historyHash.unshift(shastr);
  else data.historyHash = [shastr];

  return data;
});

hexo.extend.helper.register('historyParseTime', function (str) {
  return (str.match(/#.*$/)[0] || '').replace(/^#(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\+\d{1,2}:\d{1,2}$/,
    ($, $Y, $M, $D) => {
      return `${$Y}年${$M}月${$D}日`;
    }
  );
});

hexo.extend.helper.register('historyParseHash', function (str) {
  return str.match(/^.{6}/)[0] || 'Null';
});

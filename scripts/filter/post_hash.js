/**
 * Update post hash as well as date in front matter
 * Set historyHash to false in theme config to disable it for all posts
 * Set historyHash to false in post front matter to disable it for this post
 * @author Sshwy
 */

/* global hexo */

const jsYaml = require('js-yaml');
const crypto = require('crypto');
const fs = require('fs');
const moment = require('moment');
const timezone = hexo.config.timezone || 'Asia/Shanghai';

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
function updatePostHash (data) {
  if(this.theme.config.historyHash === false || data.historyHash === false) return data;

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
    data.date = latestTime.utc();
    return data;
  }

  const newFrontMatterStr = jsYaml.dump(obj, { indent: 2 });
  const newRaw = data.raw.replace(/^---\n(.*?)\n---\n/s, () => `---\n${newFrontMatterStr}---\n`);

  fs.writeFileSync(data.full_source, newRaw, { encoding: 'utf8' });

  if (data.historyHash) data.historyHash.unshift(shastr);
  else data.historyHash = [shastr];
  data.date = currentTime.utc();
  data.raw = newRaw;

  return data;
}

hexo.extend.filter.register('before_post_render', updatePostHash);
/**
 * Update post hash as well as date in front matter
 * Set historyHash to false in theme config to disable it for all posts
 * Set historyHash to false in post front matter to disable it for this post
 * @author Sshwy
 */

/* global hexo */

const crypto = require('crypto');
const fs = require('fs');
const moment = require('moment-timezone');
const timezone = hexo.config.timezone || 'Asia/Shanghai';
const { parseFrontMatter, replaceFrontMatter } = require('./utils');

function shaHash (raw) {
  let shasum = crypto.createHash('sha1');
  shasum.update(raw);
  return shasum.digest('hex');
}
function updatePostHash (data) {
  const config = this.theme.config,
    getHash = s => s.replace(/#.*$/, ''),
    getTime = s => s.replace(/^.*?#/, '');

  if (config.historyHash === false || data.historyHash === false) { // disabled
    return data;
  }

  const obj = parseFrontMatter(data.raw);

  if (obj === null) { // frontmatter notfound
    return data;
  }

  const rawContent = data.raw.replace(/^---\n(.*?)\n---\n/s, ''),
    currentTime = moment().tz(timezone),
    shastr = shaHash(rawContent) + '#' + currentTime.format();

  let flag = true;
  if (!Array.isArray(obj.historyHash) || getHash(obj.historyHash[0]) !== getHash(shastr)) {
    flag = false;
    if (Array.isArray(obj.historyHash)) {
      obj.historyHash.unshift(shastr);
    } else {
      obj.historyHash = [shastr];
    }
  }

  const latestHashTime = moment(getTime(obj.historyHash[0])).tz(timezone);
  if (obj.date !== latestHashTime.tz(timezone).format()) {
    flag = false;
    obj.date = latestHashTime.tz(timezone).format();
  }
  if (flag) { // update frontmatter:date by hash time
    data.date = latestHashTime.utc();
    return data;
  }

  hexo.log.info(`[hexo-theme-essence] Update post hash for "${data.title}"`);

  const newRaw = replaceFrontMatter(data.raw, obj);
  fs.writeFileSync(data.full_source, newRaw, { encoding: 'utf8' });

  if (data.historyHash) data.historyHash.unshift(shastr);
  else data.historyHash = [shastr];
  data.date = currentTime.utc();
  data.raw = newRaw;

  return data;
}

hexo.extend.filter.register('before_post_render', updatePostHash);
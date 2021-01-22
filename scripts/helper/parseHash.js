/* global hexo */
const moment = require('moment');

const timezone = hexo.config.timezone || 'Asia/Shanghai';
const language = hexo.config.language || 'en';

function _date(obj, fmt){
  return moment(obj).tz(timezone).locale(language).format(fmt);
}
function hashParseTime(s){
  return _date(s.match(/#(.*?)$/)[1] || '', 'LL');
}
function hashParseHash(s){
  return s.match(/^.{6}/)[0] || 'Null';
}

hexo.extend.helper.register('lctzDate', _date);
hexo.extend.helper.register('historyParseTime', hashParseTime);
hexo.extend.helper.register('historyParseHash', hashParseHash);
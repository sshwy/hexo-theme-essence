function wordCount (s) {
  const ignore = /[\s,.:;'"*&^%$#@!?+=()[\]{}|/\\，。：“”‘’《》<>；、？！￥…—（）\-`～~]+/g;
  console.log('wordCount', typeof s);
  s = (s || '').replace(ignore, '');
  return s.length;
}

function insertComma (num, dist = 3, sep = ','){
  const reg = new RegExp(`(?=(\\d{${dist}})+$)(?!^)`, 'g');
  return String(num).replace(reg,sep);
}

module.exports = {
  wordCount,
  insertComma,
};
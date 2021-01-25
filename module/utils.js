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

function md5(data) {
  var i, j, k;
  var tis = [], abs = Math.abs, sin = Math.sin;
  for (i = 1; i <= 64; i++)tis.push(0x100000000 * abs(sin(i)) | 0);
  var l = ((data.length + 8) >>> 6 << 4) + 15, s = new Uint8Array(l << 2);
  s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
  s[data.length >> 2] |= 0x80 << (data.length << 3 & 31);
  s[l - 1] = data.length << 3;
  var params = [
      [function (a, b, c, d, x, s, t) {
        return C(b & c | ~b & d, a, b, x, s, t);
      }, 0, 1, 7, 12, 17, 22], [function (a, b, c, d, x, s, t) {
        return C(b & d | c & ~d, a, b, x, s, t);
      }, 1, 5, 5, 9, 14, 20], [function (a, b, c, d, x, s, t) {
        return C(b ^ c ^ d, a, b, x, s, t);
      }, 5, 3, 4, 11, 16, 23], [function (a, b, c, d, x, s, t) {
        return C(c ^ (b | ~d), a, b, x, s, t);
      }, 0, 7, 6, 10, 15, 21]
    ], C = function (q, a, b, x, s, t) {
      return a = a + q + (x | 0) + t, (a << s | a >>> (32 - s)) + b | 0;
    }, m = [1732584193, -271733879], o;
  m.push(~m[0], ~m[1]);
  for (i = 0; i < s.length; i += 16) {
    o = m.slice(0);
    for (k = 0, j = 0; j < 64; j++)m[k & 3] = params[j >> 4][0](
      m[k & 3], m[++k & 3], m[++k & 3], m[++k & 3],
      s[i + (params[j >> 4][1] + params[j >> 4][2] * j) % 16],
      params[j >> 4][3 + j % 4], tis[j]
    );
    for (j = 0; j < 4; j++)m[j] = m[j] + o[j] | 0;
  }
  return new Uint8Array(new Uint32Array(m).buffer);
}

function encodeUTF8(s) {
  var i, r = [], c, x;
  for (i = 0; i < s.length; i++)
    if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
    else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
    else {
      if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
        c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
        r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
      else r.push(0xE0 + (c >> 12 & 0xF));
      r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
    }
  return r;
}

function md5str (str) {
  let data = new Uint8Array(encodeUTF8(str));
  let result = md5(data);
  let hex = Array.prototype.map.call(result, function (e) {
    return (e < 16 ? '0' : '') + e.toString(16);
  }).join('');
  return hex;
}

function toCharArray(s){
  return s.replace(/()/g,':><:').split(/:><:/).filter(c => c);
}

module.exports = {
  wordCount,
  insertComma,
  md5str,
  toCharArray,
};
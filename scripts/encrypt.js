/* global hexo */

function Md5 (data) {
  var i, j, k;
  var tis = [],
    abs = Math.abs,
    sin = Math.sin;
  for (i = 1; i <= 64; i++) tis.push(0x100000000 * abs(sin(i)) | 0);
  var l = ((data.length + 8) >>> 6 << 4) + 15,
    s = new Uint8Array(l << 2);
  s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
  s[data.length >> 2] |= 0x80 << (data.length << 3 & 31);
  s[l - 1] = data.length << 3;
  var params = [
    [function (a, b, c, d, x, s, t) {
      return C(b & c | ~b & d, a, b, x, s, t);
    }, 0, 1, 7, 12, 17, 22],
    [function (a, b, c, d, x, s, t) {
      return C(b & d | c & ~d, a, b, x, s, t);
    }, 1, 5, 5, 9, 14, 20],
    [function (a, b, c, d, x, s, t) {
      return C(b ^ c ^ d, a, b, x, s, t);
    }, 5, 3, 4, 11, 16, 23],
    [function (a, b, c, d, x, s, t) {
      return C(c ^ (b | ~d), a, b, x, s, t);
    }, 0, 7, 6, 10, 15, 21]
  ],
    C = function (q, a, b, x, s, t) {
      return a = a + q + (x | 0) + t, (a << s | a >>> (32 - s)) + b | 0;
    },
    m = [1732584193, -271733879],
    o;
  m.push(~m[0], ~m[1]);
  for (i = 0; i < s.length; i += 16) {
    o = m.slice(0);
    for (k = 0, j = 0; j < 64; j++) m[k & 3] = params[j >> 4][0](
      m[k & 3], m[++k & 3], m[++k & 3], m[++k & 3],
      s[i + (params[j >> 4][1] + params[j >> 4][2] * j) % 16],
      params[j >> 4][3 + j % 4], tis[j]
    );
    for (j = 0; j < 4; j++) m[j] = m[j] + o[j] | 0;
  };
  return new Uint8Array(new Uint32Array(m).buffer);
};

function encodeUTF8 (s) {
  var i, r = [],
    c, x;
  for (i = 0; i < s.length; i++)
    if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
    else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
    else {
      if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
        c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
          r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
      else r.push(0xE0 + (c >> 12 & 0xF));
      r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
    };
  return r;
};

function md5 (str) {
  var data = new Uint8Array(encodeUTF8(str));
  var result = Md5(data);
  var hex = Array.prototype.map.call(result, function (e) {
    return (e < 16 ? "0" : "") + e.toString(16);
  }).join("");
  return hex;
}
var c2i = {
  'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6,
  'h': 7, 'i': 8, 'j': 9, 'k': 10, 'l': 11, 'm': 12, 'n': 13,
  'o': 14, 'p': 15, 'q': 16, 'r': 17, 's': 18, 't': 19, 'u': 20,
  'v': 21, 'w': 22, 'x': 23, 'y': 24, 'z': 25, '0': 26, '1': 27,
  '2': 28, '3': 29, '4': 30, '5': 31, '6': 32, '7': 33, '8': 34,
  '9': 35, '.': 36, ',': 37
};
var i2c = {
  0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g',
  7: 'h', 8: 'i', 9: 'j', 10: 'k', 11: 'l', 12: 'm', 13: 'n',
  14: 'o', 15: 'p', 16: 'q', 17: 'r', 18: 's', 19: 't', 20: 'u',
  21: 'v', 22: 'w', 23: 'x', 24: 'y', 25: 'z', 26: '0', 27: '1',
  28: '2', 29: '3', 30: '4', 31: '5', 32: '6', 33: '7', 34: '8',
  35: '9', 36: '.', 37: ','
};
var sz = 38;

function encrypt (key, plain) { //加密
  var unicode = "";
  for (var i = 0; i < plain.length; i++) {
    unicode += plain.charCodeAt(i).toString(16);
    unicode += "."; //分隔符
  }
  var cipher = "";
  for (var i = 0; i < unicode.length; i++) {
    cipher += i2c[(c2i[unicode[i]] + c2i[key[i % key.length]]) % sz];
  }
  return cipher;
}
var totid_encrypt = 0;
function encrypttag (args, content) {
  var key = args[0] || ".";
  var hint = args.slice(1).join(' ') || "";
  var str = hexo.render.renderSync({ text: content, engine: 'markdown' });
  totid_encrypt += 1;
  var sid = totid_encrypt.toString();
  str = encrypt(key, str);
  str = `<div id="encrypted${sid}" style="display: none;">${str}</div>`;
  str += `<div id="encButton${sid}">
            <p><div class="encrypt-container">
                <input type="text" class="encrypt-key-inputarea" placeholder="${hint ? "提示：" + hint : ""}" 
                    id="key${sid}" onkeydown='if(event.keyCode==13){decrypt(${sid});}'value=""> 
                <input type="submit" class="decrypt-button" value="解密" onclick="decrypt(${sid})">
            </div></p>
            <div id="keyMd5${sid}" style="display: none;">${md5(key)}</div>
          </div>`;
  return str;
}
hexo.extend.tag.register('enc', encrypttag, { ends: true });

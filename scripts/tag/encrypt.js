/* global hexo */

const { md5str } = require('../../module/utils');

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
  let unicode = '';
  for (let i = 0; i < plain.length; i++) {
    unicode += plain.charCodeAt(i).toString(16);
    unicode += '.'; //分隔符
  }
  let cipher = '';
  for (let i = 0; i < unicode.length; i++) {
    cipher += i2c[(c2i[unicode[i]] + c2i[key[i % key.length]]) % sz];
  }
  return cipher;
}

var totid_encrypt = 0;

function encrypttag (args, content) {
  let key = args[0] || '.';
  let hint = args.slice(1).join(' ') || '';
  let str = hexo.render.renderSync({ text: content, engine: 'markdown' });
  totid_encrypt += 1;
  let sid = totid_encrypt.toString();
  str = encrypt(key, str);
  str = `<div id="encrypted${sid}" style="display: none;">${str}</div>`;
  str += `<div id="encButton${sid}">
            <p><div class="encrypt-container">
                <input type="text" class="encrypt-key-inputarea" placeholder="${hint ? '提示：' + hint : ''}" 
                    id="key${sid}" onkeydown='if(event.keyCode==13){decrypt(${sid});}'value=""> 
                <input type="submit" class="decrypt-button" value="解密" onclick="decrypt(${sid})">
            </div></p>
            <div id="keyMd5${sid}" style="display: none;">${md5str(key)}</div>
          </div>`;
  return str;
}

hexo.extend.tag.register('enc', encrypttag, { ends: true });
hexo.extend.tag.register('encrypt', encrypttag, { ends: true });
/* global hexo */

const { md5str } = require('../../module/utils');
const { i2c, c2i, sz} = require('../../module/cipherCode');

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
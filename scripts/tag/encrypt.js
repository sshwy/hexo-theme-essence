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
  let sid = totid_encrypt.toString();
  const decryptText = hexo.theme.i18n.__(hexo.config.language || 'en')('post.decrypt');

  totid_encrypt += 1;

  str = encrypt(key, str);
  str = `<div id="encrypted${sid}" style="display: none;">${str}</div>`;
  str += `<div id="encpart${sid}">`
    + '<div class="encrypt-container">'
    + `<input type="text" placeholder="${hint}" autocomplete="off" `
    + `id="key${sid}" onkeydown="if(event.keyCode==13){decrypt(${sid});}" value="">`
    + `<input type="submit" value="${decryptText}" onclick="decrypt(${sid})">`
    + '<div class="inputfeedback"><span style="color: red;"></span></div>'
    + '</div>'
    + `<div id="enckey${sid}" style="display: none;">${md5str(key)}</div>`
    + '</div>';
  return str;
}

hexo.extend.tag.register('enc', encrypttag, { ends: true });
hexo.extend.tag.register('encrypt', encrypttag, { ends: true });
/* global hexo */

const { htmlTag } = require('hexo-util');
const { md5str } = require('../../module/utils');
const { i2c, c2i, sz } = require('../../module/cipherCode');

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

function encryptTag (args, content) {
  let key = md5str(args[0] || '.');
  let hint = args.slice(1).join(' ') || '';
  let str = hexo.render.renderSync({ text: content, engine: 'markdown' });
  let sid = totid_encrypt.toString();
  const decryptBtnText = hexo.theme.i18n.__(hexo.config.language || 'en')('post.decrypt');

  totid_encrypt += 1;

  str = htmlTag('div', { id: 'encrypted' + sid, style: 'display: none;' }, encrypt(key, str), false);
  str += htmlTag('div', { id: 'encpart' + sid },
    htmlTag('div', { class: 'encrypt-container' },
      htmlTag('input', {
        type: 'text',
        placeholder: hint,
        autocomplete: 'off',
        value: '',
        id: 'key' + sid,
        onkeydown: `if(event.keyCode==13){decrypt(${sid});}`
      }, null, false) +
      htmlTag('input', {
        type: 'submit',
        value: decryptBtnText,
        onclick: `decrypt(${sid})`
      }, null, false) +
      htmlTag('div', { class: 'inputfeedback' },
        htmlTag('span', { style: 'color: red' }, '', false), false
      ), false
    ) +
    htmlTag('div', {
      id: 'enckey' + sid,
      style: 'display: none;'
    }, md5str(key), false) , false
  );
  return str;
}

hexo.extend.tag.register('enc', encryptTag, { ends: true });
hexo.extend.tag.register('encrypt', encryptTag, { ends: true });
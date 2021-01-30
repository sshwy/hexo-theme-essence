/* global hexo */

'use strict';

const { htmlTag } = require('hexo-util');

function lgm (s) {
  return htmlTag('strong', { class: 'lgm-head' }, s[0], false) 
    + htmlTag('strong', { class: 'lgm-tail' }, s.substring(1), false);
}
function com (s) {
  return htmlTag('strong', {}, s, false);
}
function renderer (text, type, link) {
  type = (type || '').trim();
  return htmlTag('a', { href: link, target: '_blank', style: 'text-decoration: none;' },
    htmlTag('span', { class: 'codeforces ' + type }, type === 'lgm' ? lgm(text) : com(text), false)
    , false);
}
function codeforcesUser (args) {
  args = args.join(' ').split('@');
  let classes = (args[0] || '').trim().toLowerCase();
  let text = (args[1] || '').trim();

  !text && hexo.log.warn('Codeforces username must be defined!');

  const link = `https://codeforces.com/profile/${text}`;

  return renderer(text, classes, link);
}

hexo.extend.tag.register('cf', codeforcesUser, { ends: false });
hexo.extend.tag.register('codeforces', codeforcesUser, { ends: false });

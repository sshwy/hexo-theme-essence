/* global hexo */

'use strict';

function lgm (s) {
  return `<strong class="lgm-head">${s[0]}</strong><strong class="lgm-tail">${s.substring(1)}</strong>`;
}
function com (s) {
  return `<strong>${s}</strong>`;
}
function renderer (text, type, link) {
  type = (type || '').trim();
  if (type) type = ' ' + type;
  return `<a href="${link}" target="_blank" style="text-decoration: none;">`
    + `<span class="codeforces${type}">${type == ' lgm' ? lgm(text) : com(text)}</span>`
    + '</a>';
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

/* global hexo */

'use strict';

function codeforcesUser (args) {
  args = args.join(' ').split('@');
  let classes = args[0] || 'unr';
  let text = args[1] || '';

  classes = classes.trim().toLowerCase();
  text = text.trim();
  !text && hexo.log.warn('Codeforces username must be defined!');

  const link = `https://codeforces.com/profile/${text}`;

  function lgm (s) {
    return `<strong class="lgm-head">${s[0]}</strong><strong class="lgm-tail">${s.substring(1)}</strong>`;
  }
  function com (s) {
    return `<strong>${s}</strong>`;
  }

  switch (classes) {
    case 'lgm':
      return `<a href="${link}" target="_blank" style="text-decoration: none;"><span class="codeforces ${classes}">${lgm(text)}</span></a>`;
    case 'igm':
    case 'gm':
    case 'im':
    case 'm':
    case 'cm':
    case 'e':
    case 's':
      return `<a href="${link}" target="_blank" style="text-decoration: none;"><span class="codeforces ${classes}">${com(text)}</span></a>`;
    default:
      return text;
  }
}

hexo.extend.tag.register('codeforces', codeforcesUser, { ends: false });

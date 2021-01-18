/* global hexo */

'use strict';

function postLabel(args) {
  //hexo.log.warn(hexo.config.author);
  //hexo.log.warn(hexo.theme.config.katex);
  args = args.join(' ').split('@');
  let classes = args[0] || 'default';
  let text    = args[1] || '';

  !text && hexo.log.warn('Label text must be defined!');

  return `<span class="label ${classes.trim()}">${text}</span>`;
}

hexo.extend.tag.register('label', postLabel, {ends: false});

/* global hexo */

'use strict';

const { htmlTag } = require('hexo-util');

function labelTag (args) {
  args = args.join(' ').split('@');
  const classes = args[0] || 'default';
  const text = args[1] || '';

  !text && hexo.log.warn('Label text must be defined!');

  return htmlTag('span', { class: 'label ' + classes }, text, false);
}

hexo.extend.tag.register('label', labelTag, { ends: false });

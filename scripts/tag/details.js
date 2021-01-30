/* global hexo */

'use strict';

const { htmlTag } = require('hexo-util');

function detailsTag (args, content) {
  args = args.join(' ').split('@');
  const isOpen = args[0] ? true : false;
  const summary = (args[1] || 'Details').trim();
  const str = hexo.render.renderSync({ text: content, engine: 'markdown' });

  return htmlTag('details', { open: isOpen }, htmlTag('summary', {}, summary, false) + str, false);
}

hexo.extend.tag.register('details', detailsTag, { ends: true });

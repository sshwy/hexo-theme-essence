/* global hexo */

const tocHelper = require('./toc');

hexo.extend.helper.register('anchorToc', tocHelper);
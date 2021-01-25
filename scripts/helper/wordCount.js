/* global hexo */

const { wordCount, insertComma } = require('../../module/utils');

hexo.extend.helper.register('wordCount', s => insertComma(wordCount(s || '')));
hexo.extend.helper.register('insertComma', insertComma);
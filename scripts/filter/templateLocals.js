/* global hexo */

const { wordCount } = require('../../module/utils');
const { readFileSync } = require('fs');
const { resolve } = require('path');

var tot = 0,
  themeVersion = null,
  contribution_date = [];


hexo.extend.filter.register('before_post_render', function (data) {
  tot += wordCount(data.raw.replace(/^---([\s\S]*?)---/, ''));
  return data;
});

hexo.extend.filter.register('before_post_render', function (data) {
  console.log(data.historyHash);
  if(Array.isArray(data.historyHash)) {
    const list = data.historyHash
      .map(hash => hash.match(/^.*?#(.*?)T.*$/)[1]);
    contribution_date = contribution_date.concat(list);
  }
}, 9999);

hexo.extend.filter.register('template_locals', function (locals) {
  if (themeVersion === null) getThemeVersion();

  return Object.assign(locals, {
    totalWords: tot,
    themeVersion,
    contribution_date,
  });
});

function getThemeVersion () {
  const oPkg = JSON.parse(readFileSync(resolve(hexo.theme_dir, 'package.json'), 'utf-8'));
  themeVersion = oPkg.version ? 'v' + oPkg.version : '';
}
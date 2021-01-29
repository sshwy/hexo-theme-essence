/* global hexo */

const { wordCount } = require('../../module/utils');
const { readFileSync } = require('fs');
const { resolve } = require('path');

var tot = 0;
var themeVersion = null;

function getThemeVersion() {
  const oPkg = JSON.parse(readFileSync(resolve(hexo.theme_dir, 'package.json'), 'utf-8'));
  themeVersion = oPkg.version ? 'v' + oPkg.version : '';
}

hexo.extend.filter.register('before_post_render', function(data){
  tot += wordCount(data.raw.replace(/^---([\s\S]*?)---/,''));
  return data;
});

hexo.extend.filter.register('template_locals', function(locals){
  if(themeVersion === null) getThemeVersion();
  locals.totalWords = tot;
  locals.themeVersion = themeVersion;
  return locals;
});
/* global hexo */

const { wordCount } = require('../../module/utils');

var tot = 0;

hexo.extend.filter.register('before_post_render', function(data){
  tot += wordCount(data.raw.replace(/^---([\s\S]*?)---/,''));
  return data;
});

hexo.extend.filter.register('template_locals', function(locals){
  // console.log('tot: ', insertComma(tot, 3, '.'));
  locals.totalWords = tot;
  return locals;
});
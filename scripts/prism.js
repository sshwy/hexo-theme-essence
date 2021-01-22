/* global hexo */
/**
 * Load prism theme file
 * Place custom css stylesheet file in base_dir/prism/
 * MAKE SURE to replace the .css suffix with .styl!
 * then modify base_dir/_config.essence.yml to apply it.
 */

const { resolve }= require('path');

hexo.extend.filter.register('stylus:renderer', function(style) {
  console.log('Load prism themes for stylus renderer');
  console.log(hexo.base_dir);
  console.log(hexo.theme_dir);
  const paths = [
    resolve(hexo.theme_dir, 'prism'),
    resolve(hexo.base_dir, 'prism')
  ];
  paths.forEach(path => style.include(path));
});
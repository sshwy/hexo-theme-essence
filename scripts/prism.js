/* global hexo */

/**
 * Load prism theme file
 * Place custom css stylesheet file in base_dir/prism/
 * MAKE SURE to replace the .css suffix with .styl!
 * then modify base_dir/_config.essence.yml to apply it.
 */

const { resolve }= require('path');
const log = require('hexo-log')({ debug: false, silent: false });

hexo.extend.filter.register('stylus:renderer', function(style) {
  log.info('Load prism themes for stylus renderer');
  const paths = [
    resolve(hexo.theme_dir, 'prism'),
    resolve(hexo.base_dir, 'prism')
  ];
  paths.forEach(path => style.include(path));
});
/**
 * Load prism theme file (.styl)
 * Place custom css stylesheet file in base_dir/prism/
 * MAKE SURE to replace the .css suffix with .styl!
 * then modify base_dir/_config.essence.yml to apply it.
 * @author Sshwy
 */

/* global hexo */

const { resolve }= require('path');

hexo.extend.filter.register('stylus:renderer', function(style) {
  hexo.log.i('[hexo-theme-essence] Load prism themes for stylus renderer');
  const paths = [
    resolve(hexo.theme_dir, 'prism'),
    resolve(hexo.base_dir, 'prism')
  ];
  paths.forEach(path => style.include(path));
});
/* global hexo */

hexo.extend.generator.register('comments', function () {
  const valine_paths = hexo.locals.get('posts').data.map(e => ({
    title: e.title,
    valine_path: e.valinePath,
    path: e.permalink,
  }));
  hexo.log.info('[hexo-theme-essence] generate comments page');
  hexo.log.debug(valine_paths);
  return {
    path: 'comments/',
    data: {
      valine: false,
      valine_paths: JSON.stringify(valine_paths),
    },
    layout: 'comments'
  };
});
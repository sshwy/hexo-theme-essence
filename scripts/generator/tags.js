/* global hexo */

hexo.extend.generator.register('tags', function () {
  const tags = hexo.locals.get('tags').data.map(e => ({
    name: e.name,
    count: e.length,
    path: e.path,
  }));
  tags.sort((a, b) => b.count - a.count);
  hexo.log.info('[hexo-theme-essence] generate tags page');

  return {
    path: 'tags/',
    data: {
      tags: tags,
    },
    layout: 'tags'
  };
});
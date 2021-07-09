/* global hexo */

hexo.extend.generator.register('tags', function () {
  const tags = hexo.locals.get('tags').data.map(e => ({
    name: e.name,
    count: e.length,
    path: e.path,
  }));
  hexo.log.info('[hexo-theme-essence] generate tags page');

  // console.log(tags);

  return {
    path: 'tags/',
    data: {
      tags: tags,
    },
    layout: 'tags'
  };
});
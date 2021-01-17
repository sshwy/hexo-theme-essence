hexo.extend.generator.register('directory', function (locals) {
  let map = new Map();
  let map_posts = new Map();
  let map_dirs = new Map();
  let map_pardirs = new Map();
  locals.posts.forEach(function (post, id) {//按路径给文章分类
    map.set(id, post);
    let path = post.source.split('/');
    let curpath = '', laspath = '';
    for (var i = 0; i < path.length - 1; i++) {
      curpath += (i == 0 ? 'directory' : path[i]) + '/'
      if (map_posts.get(curpath) == undefined) {//init
        map_posts.set(curpath, []);
        map_dirs.set(curpath, []);
        map_pardirs.set(curpath, laspath);
      }
      if (i == path.length - 2) {
        map_posts.set(curpath, map_posts.get(curpath).concat(id));
      } else if (map_dirs.get(curpath).indexOf(path[i + 1]) == -1) {
        map_dirs.set(curpath, map_dirs.get(curpath).concat(path[i + 1]));
      }
      laspath = curpath;
    }
  });

  var results = [];
  var a = map_posts.entries(), b = map_dirs.entries(), c = map_pardirs.entries();
  var cura = a.next(), curb = b.next(), curc = c.next();
  while (!cura.done) {
    results = results.concat(((path, posts_id, dirs, par_path) => {
      let posts = []
      posts_id.forEach(function (id) { posts = posts.concat(map.get(id)) });

      let dir = path.replace(par_path, '').replace('/', '');
      let title = par_path ? hexo.theme.config.directory.wordmap[dir] + ' - ' : '';
      title += hexo.theme.config.directory.title;

      return {
        path: path,
        data: {
          title: title,
          posts: posts,
          dirs: dirs,
          dir: dir,
          dir_path: path,
          par_path: par_path
        },
        layout: 'directory'
      }//对应到模板里是page变量
    })(cura.value[0], cura.value[1], curb.value[1], curc.value[1]));

    cura = a.next(), curb = b.next(), curc = c.next();
  }
  return results;
});
//逻辑：这里gen出的变量放到对应的模板上去渲染

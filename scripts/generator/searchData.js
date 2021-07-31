/* global hexo */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var moment = _interopDefault(require('moment'));
var hexoUtil = require('hexo-util');

var defaults = {
  pages: {
    date: false,
    updated: true,
    comments: false,
    path: true,
    link: false,
    permalink: false,
    excerpt: false,
    text: true,
    raw: false,
    content: false,
    author: true,
    title: true,
    slug: false, 
  },

  posts: {
    title: true,
    slug: false,
    date: false,
    updated: true,
    comments: false,
    path: true,
    link: false,
    permalink: false,
    excerpt: false,
    text: true,
    raw: false,
    content: false,
    author: true,
    categories: true,
    tags: true
  },
};

function ignoreSettings (config) {
  const ignore = config.ignore || {};

  ignore.paths = ignore.paths
    ? ignore.paths.map((path) => path.toLowerCase())
    : [];

  ignore.tags = ignore.tags
    ? ignore.tags.map((tag) => tag.replace('#', '').toLowerCase())
    : [];

  return ignore;
}

function isIgnored (content, settings) {
  if (content.hidden === false)  return false;

  if (content.password || content.hidden)  return true;

  const pathIgnored = settings.paths.find((path) => content.path.includes(path));

  if (pathIgnored)  return true;

  const tags = content.tags ? content.tags.map(mapTags) : [];
  const tagIgnored = tags.filter((tag) => settings.tags.includes(tag)).length;

  if (tagIgnored)  return true;

  return false;
}

function hasLayout(content){
  // console.log(content.layout, typeof(content.layout));
  if(content.layout === false || content.layout === 'false') return false;
  return true;
}

function mapTags (tag) {
  return typeof tag === 'object' ? tag.name.toLowerCase() : tag;
}

function has (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function minify (str) {
  return hexoUtil.stripHTML(str
    .replace(/<div(\s+?)id="encrypted(([\s\S])*?)<\/div>/g, ' ')
    .replace(/<div(\s+?)id="enckey(([\s\S])*?)<\/div>/g, ' ')
  ).trim().replace(/\s{2,}/g, ' ');
}

function getProps (ref) {
  return Object.getOwnPropertyNames(ref).filter((key) => ref[key]);
}

function catags ({ name, slug, permalink }) {
  return { name, slug, permalink };
}

function setContent (obj, item, ref, cfg) {
  switch (item) {
    case 'excerpt':
      obj.excerpt = minify(ref.excerpt);
      break;

    case 'description':
      obj.description = minify(ref.description);
      break;

    case 'text':
      obj.text = minify(ref.content);
      break;

    case 'categories':
      obj.categories = ref.categories.map(catags);
      break;

    case 'tags':
      obj.tags = ref.tags.map(catags);
      break;

    case 'date':
      obj.date = cfg.dateFormat
        ? moment(ref.date).format(cfg.dateFormat)
        : ref.date;
      break;

    case 'updated':
      obj.updated = cfg.dateFormat
        ? moment(ref.updated).format(cfg.dateFormat)
        : ref.updated;
      break;

    default:
      obj[item] = ref[item];
  }

  return obj;
}

function reduceContent (props, content, cfg) {
  return props.reduce((obj, item) => setContent(obj, item, content, cfg), {});
}

function reduceCategs (posts) {
  const source = posts
    .map((post) => ({
      categories: post.categories ? post.categories.map(JSON.stringify) : [],
      tags: post.tags ? post.tags.map(JSON.stringify) : [],
    }))
    .reduce(
      (res, item) => {
        res.categories.push(...item.categories);
        res.tags.push(...item.tags);
        return res;
      },
      { categories: [], tags: [] },
    );

  const categories = [...new Set(source.categories)].map(JSON.parse);
  const tags = [...new Set(source.tags)].map(JSON.parse);

  return { categories, tags };
}

hexo.extend.generator.register('json-content', function (site) {
  const { config } = this.theme;
  if(!config.search.enable) return [];

  const defs = { meta: true };
  const opts = config.search || {};
  const options = { ...defs, ...opts };
  const pages = has(options, 'pages') ? options.pages : defaults.pages;
  const posts = has(options, 'posts') ? options.posts : defaults.posts;
  const ignore = ignoreSettings(options);
  const categs = {
    categories: [],
    tags: [],
  };

  let output = options.meta ? {
    meta: {
      title: config.title,
      subtitle: config.subtitle,
      description: config.description,
      author: config.author,
      url: config.url,
      root: config.root,
    },
  } : {};

  // console.log('config: ', config);
  if (pages) {
    const pagesProps = getProps(pages);
    const pagesValid = site.pages.filter((page) => !isIgnored(page, ignore) && hasLayout(page));
    const pagesContent = pagesValid.map((page) =>
      reduceContent(pagesProps, page, options),
    );

    if (posts || options.meta) {
      output = Object.assign(output, { pages: pagesContent });

      const pagesCategs = reduceCategs(pagesContent);

      categs.categories.push(...pagesCategs.categories);
      categs.tags.push(...pagesCategs.tags);
    } else {
      output = pagesContent;
    }
  }

  if (posts) {
    const postsProps = getProps(posts);
    const postsSorted = site.posts.sort('-date');
    const postsValid = postsSorted.filter((post) => {
      const include = options.drafts || post.published;
      return include && !isIgnored(post, ignore);
    });
    const postsContent = postsValid.map((post) =>
      reduceContent(postsProps, post, options),
    );

    if (pages || options.meta) {
      output = Object.assign(output, { posts: postsContent });

      const postsCategs = reduceCategs(postsContent);

      categs.categories.push(...postsCategs.categories);
      categs.tags.push(...postsCategs.tags);
    } else {
      output = postsContent;
    }
  }

  if (pages || posts || options.meta) Object.assign(output, reduceCategs([categs]));

  return {
    path: 'search.json',
    data: JSON.stringify(output),
  };
});

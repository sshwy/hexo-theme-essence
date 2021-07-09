import { highlight, Weight } from './utils';

function parse (post, regexp) {
  const arround_length = 30;
  const results_count = 3;
  let weight = 0;
  let i = post.text.search(regexp);
  if (post.title.search(regexp) != -1) weight += Weight.title;
  if (i != -1
    || post.title.search(regexp) != -1
    || post.tags && post.tags.some(function (tag) {
      return tag.name.search(regexp) != -1;
    })
  ) {
    let occurrences = [], tags = [];
    const totlen = post.text.length;
    while (i != -1 && occurrences.length < results_count) {
      let L = i - arround_length, R = i + arround_length;
      if (L < 0) L = 0;
      if (R > totlen) R = totlen;
      occurrences.push(post.text.slice(L, R));
      weight += Weight.normal;
      if (R == totlen) break;
      i = post.text.slice(R).search(regexp);
      if (i != -1) i += R;
    }
    if (post.tags) {
      weight += Weight.tag;
      tags = post.tags.filter(tag => tag.name.search(regexp) != -1).map(tag => ({
        name: tag.name,
        permalink: tag.permalink
      }));
    }
    return {
      title: post.title,
      path: '/' + post.path,
      occurrences: occurrences,
      tags: tags,
      weight: weight
    };
  } else return null;
}

function render (data, regexp) {
  if (data === null) return null;
  const lst = data.occurrences.map(s => '<li>' + highlight(s, regexp) + '……' + '</li>');
  const occ = lst ? '<ul>' + lst.join('') + '</ul>' : '';
  const tags = data.tags.map(tag =>
    '<span class="tag">'
    + '<span class="iconfont icon-tag"></span>'
    + `<a class="tag" href="${tag.permalink}" target="_blank" rel="noreferrer noopener">`
    + highlight(tag.name, regexp)
    + '</a>'
    + '</span>'
  );
  const output = '<div class="search-post">'
    + '<div class="search-post-title">'
    + '<span class="title">'
    + `<a href="${data.path}" target="_blank" rel="noreferrer noopener">`
    + highlight(data.title, regexp)
    + '</a>' + '</span>' + tags.join(' ')
    + '</div>'
    + `<div class="search-post-content">${occ}</div>`
    + '</div>';
  return {
    output: output,
    weight: data.weight,
  };
}

/**
 * 在文章中搜索关键词
 *
 * @param {string} post
 * @param {RegExp} regexp
 * @return {{output: string, weight: number}} 
 */
function searcher (post, regexp) {
  return render(parse(post, regexp), regexp);
}

export default searcher;
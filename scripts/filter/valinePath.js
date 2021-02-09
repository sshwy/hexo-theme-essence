/* global hexo */
const { parseFrontMatter, replaceFrontMatter } = require('./utils');
const fs = require('fs');

function updateValinePath (data) {
  if(this.theme.config.valine.enable === false || data.valinePath) return data;

  const obj = parseFrontMatter(data.raw);
  if(obj === null || obj.valinePath)return data;

  obj.valinePath = '/' + data.path.replace(/index\.html$/,'');
  data.valinePath = obj.valinePath;

  const newRaw = replaceFrontMatter(data.raw, obj);
  fs.writeFileSync(data.full_source, newRaw, { encoding: 'utf8' });

  return data;
}

hexo.extend.filter.register('before_post_render', updateValinePath);
const jsYaml = require('js-yaml');

/**
 * 解析 markdown 文本中的 front matter，
 * 注意必须以 ---.....--- 开头才会被解析到
 *
 * @param {string} raw
 * @return {object} 返回 front matter 对象
 */
function parseFrontMatter(raw){
  const frontMatterMatch = raw.match(/^---\n(.*?)\n---\n/s);
  if (frontMatterMatch === null) return null;
  return jsYaml.load(frontMatterMatch[1] || '', { schema: jsYaml.JSON_SCHEMA });
}

/**
 * 替换 markdown 文本中的 front matter，
 * 如果该文本中解析不出 front matter 就啥也不做
 *
 * @param {string} raw markdown 文本
 * @param {object} obj front matter 对象
 * @return {string} 返回替换后的 markdown 文本 
 */
function replaceFrontMatter(raw, obj) {
  return raw.replace(/^---\n(.*?)\n---\n/s, () => `---\n${jsYaml.dump(obj, { indent: 2 })}---\n`);
}

module.exports = {
  parseFrontMatter,
  replaceFrontMatter,
};
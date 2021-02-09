const jsYaml = require('js-yaml');

function parseFrontMatter(raw){
  const frontMatterMatch = raw.match(/^---\n(.*?)\n---\n/s);
  if (frontMatterMatch === null) return null;
  return jsYaml.load(frontMatterMatch[1] || '', { schema: jsYaml.JSON_SCHEMA });
}
function replaceFrontMatter(raw, obj) {
  return raw.replace(/^---\n(.*?)\n---\n/s, () => `---\n${jsYaml.dump(obj, { indent: 2 })}---\n`);
}

module.exports = {
  parseFrontMatter,
  replaceFrontMatter,
};
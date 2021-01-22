/* global hexo */

function insertComma (num){
  return String(num).replace(/(?=(\d{3})+$)(?!^)/g,',');
}
function wordCount (s) {
  const ignore = /[{}[\]()\-+\\/!,.'"，。“”‘’「」·、（）！？《》\s:;；：]+/g;
  s.replace(ignore, '');
  return insertComma(s.length);
}

hexo.extend.helper.register('wordCount', wordCount);
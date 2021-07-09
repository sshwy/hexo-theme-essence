export default function () {
  const old = document.getElementsByClassName('toc-content')[0];
  if(!old) return;

  const sectionTitles = document.getElementsByClassName('post-content')[0].getElementsByClassName('headerlink');

  if(sectionTitles.length === 0) return;

  let toc = document.createElement('ol');
  toc.setAttribute('class', 'toc');

  let sectionNumbers = [0, 0, 0, 0, 0, 0], nodes = [toc, 0, 0, 0, 0, 0];

  for (const node of sectionTitles) {
    const data = {
      id: node.id || node.parentElement.id || '',
      level: parseInt(node.parentElement.tagName.charAt(1)) - 1,
      text: node.parentElement.textContent
    };

    sectionNumbers[data.level]++;
    sectionNumbers[data.level + 1] = 0;
    const tocNumber = sectionNumbers.slice(1, data.level + 1).join('.') + '. ';
    const tocText = data.text;

    const spanTocNumber = `<span class="toc-number">${tocNumber}</span>`;
    const spanTocText = `<span class="toc-text">${tocText}</span>`;
    const aTocLink = `<a class="toc-link" href="#${data.id}">${spanTocNumber + spanTocText}</a>`;

    let liItem = document.createElement('li');
    liItem.setAttribute('class', 'toc-item toc-level-' + (data.level + 1).toString());
    liItem.innerHTML = aTocLink;

    nodes[data.level] = liItem;

    if (nodes[data.level - 1].tagName != 'OL') {
      let olItem = document.createElement('ol');
      olItem.setAttribute('class', 'toc-child');
      nodes[data.level - 1].appendChild(olItem);
      nodes[data.level - 1] = olItem;
    }
    nodes[data.level - 1].appendChild(liItem);
  }

  const oToc = document.querySelector('div.toc');
  oToc.setAttribute('style', ''); // remove attached style

  old.innerHTML = '';
  old.appendChild(toc);
}
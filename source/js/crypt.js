import renderKatex from './module/katex';
import { md5str } from '../../module/utils';
import { i2c, c2i, sz } from '../../module/cipherCode';

window.md5 = md5str;

window.renderKatex = () => renderKatex({
  output: 'html',
  macros: { }, // CANT REMOVE (or it will cause render error)
});

window.updateToc = function () {
  const old = document.getElementsByClassName('toc-content')[0];
  if(!old)return;

  const sectionTitles = document.getElementsByClassName('post-content')[0].getElementsByClassName('headerlink');

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

    let spanTocNumber = document.createElement('span');
    spanTocNumber.setAttribute('class', 'toc-number');
    spanTocNumber.innerHTML = tocNumber;

    let spanTocText = document.createElement('span');
    spanTocText.setAttribute('class', 'toc-text');
    spanTocText.innerHTML = tocText;

    let a = document.createElement('a');
    a.setAttribute('class', 'toc-link');
    a.setAttribute('href', '#' + data.id);
    a.appendChild(spanTocNumber);
    a.appendChild(spanTocText);

    let liItem = document.createElement('li');
    liItem.setAttribute('class', 'toc-item toc-level-' + (data.level + 1).toString());
    liItem.appendChild(a);

    nodes[data.level] = liItem;

    if (nodes[data.level - 1].tagName != 'OL') {
      let olItem = document.createElement('ol');
      olItem.setAttribute('class', 'toc-child');
      nodes[data.level - 1].appendChild(olItem);
      nodes[data.level - 1] = olItem;
    }
    nodes[data.level - 1].appendChild(liItem);
  }

  old.innerHTML = '';
  old.appendChild(toc);
};

window.decrypt = function (idx) {
  const oPart = document.getElementById('encpart' + idx),
    oContent = document.getElementById('encrypted' + idx),
    oFeedback = oPart.querySelector('.inputfeedback span');

  idx = idx.toString();
  const key = oPart.querySelector('input[type="text"]').value;
  var keymd5 = window.md5(key);
  if (document.getElementById('enckey' + idx).innerHTML != keymd5) {
    console.log('Your key is not correct!');
    oFeedback.innerHTML = 'Your key is not correct!';
    return;
  }
  oContent.style.display = '';
  let cipher = oContent.innerHTML;

  let unicode = '';
  for (var i = 0; i < cipher.length; i++) {
    unicode += i2c[(c2i[cipher[i]] - c2i[key[i % key.length]] + sz) % sz];
  }
  let plain = '';
  let lst = unicode.split('.');
  for (let i = 0; i < lst.length - 1; i++) {//最最后一个字符是空的
    plain += String.fromCharCode(parseInt(lst[i], 16).toString(10));
  }

  oContent.innerHTML = plain;
  oPart.style.display = 'none';

  visitorRecord(idx);
  window.renderKatex();
  window.updateToc();
};

function visitorRecord (idx) {
  const { returnCitySN, rtcIp, AV, browserTypeObject } = window;

  const EncryptVisiter = AV.Object.extend('EncryptListener');
  let evObj = new EncryptVisiter();
  evObj.set('date', new Date());
  evObj.set('url', document.location.pathname);
  evObj.set('sid', idx);
  if (typeof (returnCitySN) != 'undefined') {
    evObj.set('cip', returnCitySN['cip']);
    evObj.set('cid', returnCitySN['cid']);
    evObj.set('cname', returnCitySN['cname']);
  }
  evObj.set('ip', rtcIp);
  evObj.set('browser', browserTypeObject);
  evObj.save();
}
import { Md5, encodeUTF8 } from './utils';
import renderKatex from './katex';

window.encodeUTF8 = encodeUTF8;

window.md5 = function (str) {
  var data = new Uint8Array(encodeUTF8(str));
  var result = Md5(data);
  var hex = Array.prototype.map.call(result, function (e) {
    return (e < 16 ? '0' : '') + e.toString(16);
  }).join('');
  return hex;
};
var c2i = {
  'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6,
  'h': 7, 'i': 8, 'j': 9, 'k': 10, 'l': 11, 'm': 12, 'n': 13,
  'o': 14, 'p': 15, 'q': 16, 'r': 17, 's': 18, 't': 19,
  'u': 20, 'v': 21, 'w': 22, 'x': 23, 'y': 24, 'z': 25,
  '0': 26, '1': 27, '2': 28, '3': 29, '4': 30, '5': 31, '6': 32,
  '7': 33, '8': 34, '9': 35, '.': 36, ',': 37
};
var i2c = {
  0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g',
  7: 'h', 8: 'i', 9: 'j', 10: 'k', 11: 'l', 12: 'm', 13: 'n',
  14: 'o', 15: 'p', 16: 'q', 17: 'r', 18: 's', 19: 't',
  20: 'u', 21: 'v', 22: 'w', 23: 'x', 24: 'y', 25: 'z',
  26: '0', 27: '1', 28: '2', 29: '3', 30: '4', 31: '5', 32: '6',
  33: '7', 34: '8', 35: '9', 36: '.', 37: ','
};
var sz = 38;

window.renderKatex = () => renderKatex({
  output: 'html',
  macros: { }, // CANT REMOVE (or it will cause render error)
});

window.updateToc = function () {
  var sectionTitles = document.getElementsByClassName('post-content')[0].getElementsByClassName('headerlink');

  var toc = document.createElement('ol');
  toc.setAttribute('class', 'toc');

  var sectionNumbers = [0, 0, 0, 0, 0, 0], nodes = [toc, 0, 0, 0, 0, 0];

  for (var node of sectionTitles) {
    const data = {
      id: node.id || node.parentElement.id || '',
      level: parseInt(node.parentElement.tagName.charAt(1)) - 1,
      text: node.parentElement.textContent
    };

    sectionNumbers[data.level]++;
    sectionNumbers[data.level + 1] = 0;
    var tocNumber = sectionNumbers.slice(1, data.level + 1).join('.') + '. ';
    var tocText = data.text;

    var spanTocNumber = document.createElement('span');
    spanTocNumber.setAttribute('class', 'toc-number');
    spanTocNumber.innerHTML = tocNumber;

    var spanTocText = document.createElement('span');
    spanTocText.setAttribute('class', 'toc-text');
    spanTocText.innerHTML = tocText;

    var a = document.createElement('a');
    a.setAttribute('class', 'toc-link');
    a.setAttribute('href', '#' + data.id);
    a.appendChild(spanTocNumber);
    a.appendChild(spanTocText);

    var liItem = document.createElement('li');
    liItem.setAttribute('class', 'toc-item toc-level-' + (data.level + 1).toString());
    liItem.appendChild(a);

    nodes[data.level] = liItem;

    if (nodes[data.level - 1].tagName != 'OL') {
      var olItem = document.createElement('ol');
      olItem.setAttribute('class', 'toc-child');
      nodes[data.level - 1].appendChild(olItem);
      nodes[data.level - 1] = olItem;
    }
    nodes[data.level - 1].appendChild(liItem);
  }

  var old = document.getElementsByClassName('toc-content')[0];
  old.innerHTML = '';
  old.appendChild(toc);
};

window.decrypt = function (idx) {
  idx = idx.toString();
  var key = document.getElementById('key' + idx).value;
  var keymd5 = window.md5(key);
  if (document.getElementById('keyMd5' + idx).innerHTML != keymd5) {
    console.log('Your key is not correct!');
    return;
  }
  document.getElementById('encrypted' + idx).style.display = '';
  let cipher = document.getElementById('encrypted' + idx).innerHTML;
  let unicode = '';
  for (var i = 0; i < cipher.length; i++) {
    unicode += i2c[(c2i[cipher[i]] - c2i[key[i % key.length]] + sz) % sz];
  }
  let plain = '';
  let lst = unicode.split('.');
  for (let i = 0; i < lst.length - 1; i++) {//最最后一个字符是空的
    plain += String.fromCharCode(parseInt(lst[i], 16).toString(10));
  }
  document.getElementById('encrypted' + idx).innerHTML = plain;
  document.getElementById('encButton' + idx).style.display = 'none';

  const { returnCitySN, rtcIp, AV, browserTypeObject, renderKatex, updateToc } = window;

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

  renderKatex();
  updateToc();
};

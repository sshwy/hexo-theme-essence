import { Md5, encodeUTF8 } from './utils';

window.encodeUTF8 = encodeUTF8;

window.md5 = function (str) {
  var data = new Uint8Array(encodeUTF8(str));
  var result = Md5(data);
  var hex = Array.prototype.map.call(result, function (e) {
    return (e < 16 ? "0" : "") + e.toString(16);
  }).join("");
  return hex;
}
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

window.renderKatex = function () {
  for (var i = 0; i < document.scripts.length; i++) {
    if (/math\/tex/.test(document.scripts[i].type)) {
      if (/display/.test(document.scripts[i].type)) {
        var math = document.createElement('p');
        math.setAttribute('style', 'text-align:center');
        math.setAttribute('class', 'katex-display');
        katex.render(document.scripts[i].text.replace(/&lt;/g, '<').replace(/&gt;/g, '>'), math, {
          displayMode: true,
          output: "html"
        });
        document.scripts[i].after(math);
        document.scripts[i].removeAttribute('type'); // avoid multi times render
      } else {
        var math = document.createElement('span');
        math.setAttribute('class', 'katex-inline');
        katex.render(document.scripts[i].text.replace(/&lt;/g, '<').replace(/&gt;/g, '>'), math, {
          displayMode: false,
          output: "html"
        });
        document.scripts[i].after(math);
        document.scripts[i].removeAttribute('type'); // avoid multi times render
      }
    }
  }
}

window.updateToc = function () {
  var sectionTitles = document.getElementsByClassName('post-content')[0].getElementsByClassName('headerlink');

  var toc = document.createElement('ol');
  toc.setAttribute('class', 'toc');

  var sectionNumbers = [0, 0, 0, 0, 0, 0], nodes = [toc, 0, 0, 0, 0, 0];

  for (var node of sectionTitles) {
    data = {
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

    var aItem = document.createElement('a');
    aItem.setAttribute('class', 'toc-link');
    aItem.setAttribute('href', '#' + data.id);
    aItem.appendChild(spanTocNumber);
    aItem.appendChild(spanTocText);

    var liItem = document.createElement('li');
    liItem.setAttribute('class', 'toc-item toc-level-' + (data.level + 1).toString());
    liItem.appendChild(aItem);

    nodes[data.level] = liItem;

    if (nodes[data.level - 1].tagName != "OL") {
      var olItem = document.createElement('ol');
      olItem.setAttribute('class', 'toc-child');
      nodes[data.level - 1].appendChild(olItem);
      nodes[data.level - 1] = olItem;
    }
    nodes[data.level - 1].appendChild(liItem);
  }

  var old = document.getElementsByClassName('toc-content')[0];
  old.innerHTML = "";
  old.appendChild(toc);
}

window.decrypt = function (idx) {
  idx = idx.toString();
  var key = document.getElementById('key' + idx).value;
  var keymd5 = md5(key);
  if (document.getElementById('keyMd5' + idx).innerHTML != keymd5) {
    console.log('Your key is not correct!');
    return;
  }
  document.getElementById('encrypted' + idx).style.display = "";
  var cipher = document.getElementById('encrypted' + idx).innerHTML;
  var unicode = "";
  for (var i = 0; i < cipher.length; i++) {
    unicode += i2c[(c2i[cipher[i]] - c2i[key[i % key.length]] + sz) % sz];
  }
  var plain = "";
  lst = unicode.split('.');
  for (var i = 0; i < lst.length - 1; i++) {//最最后一个字符是空的
    plain += String.fromCharCode(parseInt(lst[i], 16).toString(10));
  }
  document.getElementById('encrypted' + idx).innerHTML = plain;
  document.getElementById('encButton' + idx).style.display = "none";

  var EncryptVisiterObject = AV.Object.extend('EncryptListener');
  var encryptVisiterObject = new EncryptVisiterObject();
  encryptVisiterObject.set('date', new Date());
  encryptVisiterObject.set('url', document.location.pathname);
  encryptVisiterObject.set('sid', idx);
  if (typeof (returnCitySN) != "undefined") {
    encryptVisiterObject.set('cip', returnCitySN["cip"]);
    encryptVisiterObject.set('cid', returnCitySN["cid"]);
    encryptVisiterObject.set('cname', returnCitySN["cname"]);
  }
  encryptVisiterObject.set('ip', rtcIp);
  encryptVisiterObject.set('browser', browserTypeObject);
  encryptVisiterObject.save();

  renderKatex();
  updateToc();
}

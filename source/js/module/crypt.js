import { md5str } from '../../../module/utils';
import { i2c, c2i, sz } from '../../../module/cipherCode';
import { setCookie, getCookie } from './cookie';
import updateToc from './updateToc';
import { renderKatexNoConfig } from './katex';

export function decrypt (idx, skey, record) {
  const oPart = document.getElementById('encpart' + idx),
    oContent = document.getElementById('encrypted' + idx),
    oFeedback = oPart.querySelector('.inputfeedback span');

  idx = idx.toString();
  const key = skey || md5str(oPart.querySelector('input[type="text"]').value || '');
  console.log('key:', key,'id:', idx);
  var keymd5 = md5str(key);
  if (document.getElementById('enckey' + idx).innerHTML != keymd5) {
    console.log('Your key is not correct!');
    oFeedback.innerHTML = 'Your key is not correct!';
    return;
  }
  if(!getCookie(`enckey${idx}`) || getCookie(`enckey${idx}`) !== key){
    setCookie(`enckey${idx}`, key, 7);
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

  if(record !== false) visitorRecord(idx);
  renderKatexNoConfig();
  updateToc();
}

export function decryptFromCookie () {
  console.log('auto decrypt');
  const arr = document.getElementsByClassName('encrypt-container');
  let flag = true;
  while(flag) {
    flag = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].parentElement.style.display === 'none') continue;
      const id = Number(arr[i].parentElement.id.replace('encpart', ''));
      if (isNaN(id)) continue;
      const md5key = arr[i].parentElement.children[1].innerText;
      const storedKey = getCookie(`enckey${id}`);
      if (storedKey && md5str(storedKey) === md5key) {
        window.decrypt(id, storedKey, false);
        flag = true;
        break;
      }
    }
  }
}

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
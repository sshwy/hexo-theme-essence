/* eslint-disable no-undef */
import { applyCustomDarkModeSettings, toggleDarkMode } from './module/darkmode';
import { searchInit, mobileSearchControl } from './module/search';
import getBrowserType from './module/browser-type';
import { renderKatexNoConfig } from './module/katex';
import { decrypt, decryptFromCookie } from './module/crypt';
import runRTC from './module/rtc';
import { md5str } from '../../module/utils';


(function (doc) {
  const headerDiv = doc.getElementsByClassName('header-inner')[0],
    oMenuBtn = doc.getElementById('menu-button'),
    oMenuList = doc.getElementById('menu-list'),
    oCommentBtn = doc.getElementById('comment-button'),
    oDarkmodeBtn = doc.getElementById('darkmode-button'),
    oTop = doc.getElementById('top');


  init();

  function init () {
    window.browserTypeObject = getBrowserType();
    window.renderKatex = renderKatexNoConfig;
    window.decrypt = decrypt;
    window.decryptFromCookie = decryptFromCookie;
    window.md5 = md5str;

    const event = new Event('global_function_mounted');
    document.dispatchEvent(event);

    setNavbarShadow();
    runRTC();
    setFontSize();
    bindEvent();
    applyCustomDarkModeSettings();

    if (HEXO_THEME_CONFIG.search.enable) {
      searchInit();
    }
  }

  function setFontSize () {
    const cWidth = doc.documentElement.clientWidth;
    if (cWidth <= 414) {
      doc.documentElement.style.fontSize = cWidth / 37.5 + 'px';
    } else {
      const fontSize = doc.documentElement.style.fontSize;
      if (fontSize !== '62.5%') {
        doc.documentElement.style.fontSize = '62.5%';
      }
    }

    if (cWidth > 768) {
      oMenuList.style.display = '';
      if (HEXO_THEME_CONFIG.search.enable) {
        mobileSearchControl('close');
      }
    }
  }

  function setNavbarShadow (mode = 'auto') {
    if(mode === 'auto') {
      if (window.scrollY < 10) headerDiv.classList.remove('header-shadow');
      else headerDiv.classList.add('header-shadow');
    } else if(mode === 'open') {
      headerDiv.classList.add('header-shadow');
    } else {
      headerDiv.classList.remove('header-shadow');
    }
  }

  function bindEvent () {
    doc.addEventListener('DOMContentLoaded', function () {
      window.decryptFromCookie();
    });

    doc.onscroll = () => setNavbarShadow('auto');

    window.addEventListener('resize', setFontSize, false);
    oMenuBtn.addEventListener('click', toggleMenu, false);

    oDarkmodeBtn && oDarkmodeBtn.addEventListener('click', toggleThemeMode, false);
    oTop && oTop.addEventListener('click', backToTop, false);
    oCommentBtn && oCommentBtn.addEventListener('click', goToComment, false);

    if (HEXO_THEME_CONFIG.search.enable) {
      doc.getElementsByClassName('mobile-search-icon')[0].addEventListener('click', () => mobileSearchControl('open'), false);
    }
  }

  function toggleMenu () {
    if (oMenuList.style.display == 'block') {
      oMenuList.style.display = 'none';
      setNavbarShadow('auto');
    } else {
      oMenuList.style.display = 'block';
      setNavbarShadow('open');
    }
  }

  function toggleThemeMode () {
    applyCustomDarkModeSettings(toggleDarkMode());
  }
  function backToTop () {
    doc.documentElement.scrollTop = 0;
  }
  function goToComment () {
    doc.documentElement.scrollTop = doc.getElementById('vcomments').offsetTop - 70;
  }

})(document);

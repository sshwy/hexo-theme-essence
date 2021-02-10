import { applyCustomDarkModeSettings, toggleDarkMode } from './module/darkmode';
import { searchInit, mobileSearchControl } from './module/search';

(function (doc) {
  document.addEventListener('DOMContentLoaded', function () {
    window.decryptFromCookie();
  });

  const headerDiv = doc.getElementsByClassName('header-inner')[0],
    oMenuBtn = doc.getElementById('menu-button'),
    oMenuList = doc.getElementById('menu-list'),
    oCommentBtn = doc.getElementById('comment-button'),
    oDarkmodeBtn = doc.getElementById('darkmode-button'),
    oTop = doc.getElementById('top');

  function init () {
    setFontSize();
    bindEvent();
    applyCustomDarkModeSettings();
    searchInit();
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
      mobileSearchControl('close');
    }
  }

  function bindEvent () {
    window.addEventListener('resize', setFontSize, false);
    oMenuBtn.addEventListener('click', toggleMenu, false);

    oDarkmodeBtn && oDarkmodeBtn.addEventListener('click', toggleThemeMode, false);
    oTop && oTop.addEventListener('click', backToTop, false);
    oCommentBtn && oCommentBtn.addEventListener('click', goToComment, false);

    doc.getElementsByClassName('mobile-search-icon')[0].addEventListener('click', () => mobileSearchControl('open'), false);
  }

  function toggleMenu () {
    if (oMenuList.style.display == 'block') {
      oMenuList.style.display = 'none';
    } else {
      oMenuList.style.display = 'block';
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

  init();

  doc.onscroll = function () {
    if (doc.documentElement.scrollTop < 10) headerDiv.classList.remove('header-shadow');
    else headerDiv.classList.add('header-shadow');
  };
})(document);

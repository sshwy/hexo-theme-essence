import { applyCustomDarkModeSettings, toggleDarkMode } from './darkmode';
import { getSearchData, renderSearchData, initializeSearchData } from './search';

const headerDiv = document.getElementsByClassName('header-inner')[0],
  searchHeaderDiv = headerDiv.getElementsByClassName('search')[0],
  searchInput = searchHeaderDiv.getElementsByTagName('input')[0],
  menuBtn = document.getElementById('menu-button'),
  menuList = document.getElementById('menu-list'),
  searchBox = document.getElementsByClassName('search-box')[0],
  searchContainer = searchBox.getElementsByClassName('search-container')[0],
  searchCounter = searchContainer.getElementsByClassName('search-count')[0],
  searchResult = searchContainer.getElementsByClassName('search-result')[0],
  searchCloseBtn = headerDiv.getElementsByClassName('search-close-icon')[0],
  searchShadow = document.getElementsByClassName('search-shadow')[0];

const check_hamberger = () => {
  const enable_hamberger = () => {
    menuBtn.style.display = "initial";
    menuList.style.display = "none";
    searchHeaderDiv.style.marginRight = "0";
    searchContainer.style.width = '90%';
  }
  const disable_hamberger = () => {
    menuBtn.style.display = "none";
    menuList.style.display = "initial";
    searchHeaderDiv.style.marginRight = "1.5em";
    searchContainer.style.width = '60%';
  }
  var offsetWid = window.innerWidth;
  if (offsetWid <= 600) {
    enable_hamberger();
  } else {
    disable_hamberger();
  }
}

function searchOpen () {
  console.log('focus!');
  headerDiv.classList.add('header-input-shadow');
  searchBox.classList.add('active');
  searchShadow.classList.add('active');
  console.log(searchBox);
  if (!window.searchData) initializeSearchData();
}
function searchClose (clearAll) {
  console.log('lost focus!');
  headerDiv.classList.remove('header-input-shadow');
  searchBox.classList.remove('active');
  searchShadow.classList.remove('active');
  if(clearAll){
    searchInput.value = "";
    searchResult.innerHTML = "";
    searchCounter.innerHTML = "";
  }
}

function searchSubmit (e) {
  if (e && e.keyCode === 27) {
    searchClose(false);
    e.target.blur();
  }
  const str = searchInput.value;
  if (searchData) {
    if (str) {
      console.log(str);
      renderSearchData(getSearchData(str), searchCounter, searchResult);
    }
  } else {
    console.error('searchData not defined!');
  }
}

; (function () {
  applyCustomDarkModeSettings();
  check_hamberger();

  window.chang_light_dark_mode = () => {
    applyCustomDarkModeSettings(toggleDarkMode());
  };
  window.back_to_top = () => {
    document.documentElement.scrollTop = 0;
  };
  window.go_to_comment = () => {
    document.documentElement.scrollTop = document.getElementById('vcomments').offsetTop - 70;
  };
  window.onresize = check_hamberger;
  window.searchSubmit = searchSubmit;

  menuBtn.onclick = () => {
    if (menuList.style.display == "none") menuList.style.display = "block";
    else menuList.style.display = "none";
  };
  document.onscroll = function () {
    if (document.documentElement.scrollTop < 10) headerDiv.classList.remove('header-shadow');
    else headerDiv.classList.add('header-shadow');
  }
  searchInput.addEventListener('focus', searchOpen, false);
  searchInput.addEventListener('keyup', searchSubmit, false);
  searchCloseBtn.addEventListener('click', () => searchClose(true), false);
  searchBox.addEventListener('click', () => searchClose(false), false);
  searchContainer.addEventListener('click', (e)=> {
    e.stopPropagation();
  });
})();

import { postSearch } from './parser';
import { throttle } from '../../../../module/utils';

const dq = document.querySelector.bind(document);
const headerDiv = dq('.header-inner'),
  searchInput = dq('.header-inner .search input'),
  searchBox = dq('.search-box'),
  searchContainer = dq('.search-container'),
  searchCounter = dq('.search-count'),
  searchResult = dq('.search-result'),
  searchShadow = dq('.search-shadow'),
  mobileSearchInput = dq('.mobile-search input');

function escapeRegExp (s) {
  return s.replace(/[(){}[\]|.*+?^$\\]/g, '\\$&');
}

function renderSearchData (keyword, counterNode, resultNode) {
  keyword = keyword.trim();
  let rkey = new RegExp(escapeRegExp(keyword), 'gi');
  if (!keyword.trim()) {
    const counter = 0, html = '';
    counterNode.innerHTML = `一共搜索到 ${counter} 个结果`;
    resultNode.innerHTML = html;
  } else {
    const data = {
      posts: window.searchData.posts.map(post => postSearch(post, rkey)).filter(data => data !== null),
      pages: window.searchData.pages.map(post => postSearch(post, rkey)).filter(data => data !== null),
    };
    const html = [...data.pages, ...data.posts]
      .sort((a, b) => b.weight - a.weight).map(o => o.output).join('');
    const counter = data.posts.length + data.pages.length;
    counterNode.innerHTML = `一共搜索到 ${counter} 个结果`;
    resultNode.innerHTML = html;
  }
}

var initializing_search_data = false;
var search_status = 'none';

function initializeSearchData () {
  if (initializing_search_data) return;

  initializing_search_data = true;

  if (window.searchData === undefined) {
    fetch('/search.json')
      .then(res => res.json())
      .then(function (data) {
        console.log('Search data initialize succeed!');
        window.searchData = data;
        document.getElementsByClassName('search-data-status')[0].innerHTML = '';
      })
      .catch(function (reason) {
        console.error('Search data initialize failed!');
        console.log(reason);
        document.getElementsByClassName('search-data-status')[0].innerHTML = '<span>Failed!</span>';
      });
  }
}

function bindEvent () {
  searchInput.addEventListener('focus', () => searchOpen('desktop'), false);
  searchInput.addEventListener('keyup', throttle(searchSubmit, 500), false);

  mobileSearchInput.addEventListener('focus', () => searchOpen('mobile'), false);
  mobileSearchInput.addEventListener('keyup', throttle(mobileSearchSubmit, 500), false);

  const searchCloseBtn = document.querySelector('.header-inner .search .search-close-icon');
  searchCloseBtn.addEventListener('click', () => searchClose('desktop', true), false);

  const mobileSearchCloseBtn = document.querySelector('.header-inner .mobile-search .search-close-icon');
  mobileSearchCloseBtn.addEventListener('click', () => searchClose('mobile', true), false);

  searchBox.addEventListener('click', () => searchClose(false), false);
  searchContainer.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}
function searchOpen (type) {
  search_status = type;

  if (type === 'mobile') {
    headerDiv.classList.add('mobile-search-active');
    searchBox.classList.add('active', 'mobile');
  } else {
    headerDiv.classList.add('header-input-shadow');
    searchBox.classList.add('active');
  }
  searchShadow.classList.add('active');
  if (!window.searchData) initializeSearchData();
}
function searchClose (type, clearAll) {
  search_status = 'none';

  if (type === 'mobile') {
    headerDiv.classList.remove('mobile-search-active');
    searchBox.classList.remove('active', 'mobile');
    if (clearAll) {
      mobileSearchInput.value = '';
    }
  } else {
    headerDiv.classList.remove('header-input-shadow');
    searchBox.classList.remove('active');
    if (clearAll) {
      searchInput.value = '';
    }
  }
  searchShadow.classList.remove('active');
  if (clearAll) {
    searchResult.innerHTML = '';
    searchCounter.innerHTML = '';
  }
}

function searchSubmit (e) {
  if (search_status === 'none') searchOpen('desktop');

  if (e && e.keyCode === 27) {
    searchClose('desktop', false);
    e.target.blur();
  }
  const str = searchInput.value;
  if (window.searchData) {
    renderSearchData(str, searchCounter, searchResult);
  } else {
    initializeSearchData();
  }
}

function mobileSearchSubmit (e) {
  if (search_status === 'none') searchOpen('mobile');

  if (e && e.keyCode === 27) {
    searchClose('mobile', false);
    e.target.blur();
  }
  const str = mobileSearchInput.value;
  if (window.searchData) {
    renderSearchData(str, searchCounter, searchResult);
  } else {
    initializeSearchData();
  }
}

export function searchInit () {
  bindEvent();
}

export function mobileSearchControl (method) {
  if (method === 'open') {
    headerDiv.classList.add('mobile-search-active');
    mobileSearchInput.focus();
  } else {
    searchClose('mobile', true);
  }
}
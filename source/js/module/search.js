const headerDiv = document.getElementsByClassName('header-inner')[0],
  searchInput = document.querySelector('.header-inner .search input'),
  searchBox = document.getElementsByClassName('search-box')[0],
  searchContainer = searchBox.getElementsByClassName('search-container')[0],
  searchCounter = searchContainer.getElementsByClassName('search-count')[0],
  searchResult = searchContainer.getElementsByClassName('search-result')[0],
  searchCloseBtn = document.querySelector('.header-inner .search .search-close-icon'),
  mobileSearchCloseBtn = document.querySelector('.header-inner .mobile-search .search-close-icon'),
  searchShadow = document.getElementsByClassName('search-shadow')[0],
  mobileSearchInput = document.querySelector('.mobile-search input');

function getSearchData (keyword) {
  function escapeRegExp (s) {
    return s.replace(/[(){}[\]|.*+?^$\\]/g, '\\$&');
  }

  let rkey = new RegExp(escapeRegExp(keyword), 'gi');
  let posts = [];
  const arround_length = 30;
  const results_count = 3;
  let postSearch = function (post) {
    let i = post.text.search(rkey);
    if (i != -1 ||
      post.title.search(rkey) != -1 ||
      post.tags && post.tags.some(function (tag) {
        return tag.name.search(rkey) != -1;
      })
    ) {
      let occurrences = [], tags = [], totlen = post.text.length;
      while (i != -1 && occurrences.length < results_count) {
        let L = i - arround_length, R = i + arround_length;
        if (L < 0) L = 0;
        if (R > totlen) R = totlen;
        occurrences.push(post.text.slice(L, R).replace(rkey,
          '<span class="search-key-word">$&</span>'));
        if (R == totlen) break;
        i = post.text.slice(R).search(rkey);
        if (i != -1) i += R;
      }
      post.tags && post.tags.forEach(function (tag) {
        if (tag.name.search(rkey) != -1) {
          tags.push({
            name: tag.name.replace(rkey,
              '<span class="search-key-word">$&</span>'),
            permalink: tag.permalink
          });
        }
      });
      return {
        title: post.title.replace(rkey,
          '<span class="search-key-word">$&</span>'),
        path: '/' + post.path,
        occurrences: occurrences,
        tags: tags
      };
    } else return null;
  };
  window.searchData.posts.forEach(function (post) {
    let data = postSearch(post);
    if (data) posts.push(data);
  });
  let pages = [];
  window.searchData.pages.forEach(function (post) {
    let data = postSearch(post);
    if (data) pages.push(data);
  });
  return {
    posts: posts,
    pages: pages
  };
}
function renderSearchData (data, counterEl, resultEl) {
  let html = '';
  function parse (post) {
    let occ = '';
    post.occurrences.forEach(function (str) {
      occ += `<li>${str + '……'}</li>`;
    });
    if (occ) occ = `<ul>${occ}</ul>`;
    let tags = '';
    post.tags.forEach(function (tag) {
      tags += `
        <span class="tag">
          <a class="tag" href="${tag.permalink}"
              target="_blank" rel="noreferrer noopener">#${tag.name}</a>
        </span>
      `;
    });
    return `<div class="search-post">
              <div class="search-post-title">
                <span class="title"><a href="${post.path}" target="_blank"
                    rel="noreferrer noopener">${post.title}</a></span>
                ${tags}
              </div>
              <div class="search-post-content">${occ}</div>
            </div>`;
  }
  data.pages.forEach(function (post) { html += parse(post); });
  data.posts.forEach(function (post) { html += parse(post); });
  let counter = data.posts.length + data.pages.length;
  counterEl.innerHTML = `一共搜索到 ${counter} 个结果`;
  resultEl.innerHTML = html;
}

function initializeSearchData () {
  if (window.searchData === undefined) {
    (new Promise(function (resolve, reject) {
      fetch('/search.json')
        .then(res => res.json())
        .then(function (data) {
          console.log('Search data initialize succeed!');
          window.searchData = data;
          document.getElementsByClassName('search-result')[0].innerHTML = '';
          resolve(data);
        })
        .catch(function (reason) {
          console.error('Search data initialize failed!');
          reject(reason);
        });
    })).catch(function (err) {
      console.error('Search data initialize failed!');
      console.log(err);
    });
  }
}

function bindEvent () {
  searchInput.addEventListener('focus', () => searchOpen('desktop'), false);
  searchInput.addEventListener('keyup', searchSubmit, false);

  mobileSearchInput.addEventListener('focus', () => searchOpen('mobile'), false);
  mobileSearchInput.addEventListener('keyup', mobileSearchSubmit, false);

  searchCloseBtn.addEventListener('click', () => searchClose('desktop', true), false);
  mobileSearchCloseBtn.addEventListener('click', () => searchClose('mobile', true), false);

  searchBox.addEventListener('click', () => searchClose(false), false);
  searchContainer.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}
function searchOpen (type) {
  if(type === 'mobile') {
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
  if(type === 'mobile') {
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
export function searchSubmit (e) {
  if (e && e.keyCode === 27) {
    searchClose('desktop', false);
    e.target.blur();
  }
  const str = searchInput.value;
  if (window.searchData) {
    if (str) {
      renderSearchData(getSearchData(str), searchCounter, searchResult);
    }
  } else {
    console.error('searchData not defined!');
  }
}

export function mobileSearchSubmit (e) {
  if (e && e.keyCode === 27) {
    searchClose('mobile', false);
    e.target.blur();
  }
  const str = mobileSearchInput.value;
  if (window.searchData) {
    if (str) {
      renderSearchData(getSearchData(str), searchCounter, searchResult);
    }
  } else {
    console.error('searchData not defined!');
  }
}

export function searchInit() {
  bindEvent ();
}

export function mobileSearchControl (method) {
  if(method === 'open') {
    headerDiv.classList.add('mobile-search-active');
    mobileSearchInput.focus();
  } else {
    searchClose('mobile', true);
  }
}
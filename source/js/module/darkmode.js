import LS from './localStorage';

const modeKey = 'data-user-color-scheme',
  modeKeyCSS = '--color-mode',
  rootElement = document.documentElement,
  moon = '<span class="iconfont icon-moonbyueliang"></span>',
  sun = '<span class="iconfont icon-sunfill"></span>',
  darkmode_button = document.getElementById('darkmode-button');

const getModeFromCSS = () => {
  const res = getComputedStyle(rootElement).getPropertyValue(modeKeyCSS);
  if (res.length) return res.replace(/"/g, '').trim();
  return res === 'dark' ? 'dark' : 'light';
};

const valid = { 'dark': true, 'light': true };

const resetDarkMode = () => {
  rootElement.removeAttribute(modeKey);
  LS.remove(modeKey);
};

export const applyCustomDarkModeSettings = (mode) => {
  // 接受从「开关」处传来的模式，或者从 localStorage 读取
  const cur = mode || LS.get(modeKey);

  if (cur === getModeFromCSS()) { // 当用户自定义的显示模式和 prefers-color-scheme 相同时重置、恢复到自动模式
    resetDarkMode();
  } else if (valid[cur]) { // 相比 Array#indexOf，这种写法 Uglify 后字节数更少
    rootElement.setAttribute(modeKey, cur);
  } else {
    // 首次访问或从未使用过开关、localStorage 中没有存储的值，cur 是 null
    // 或者 localStorage 被篡改，cur 不是合法值
    resetDarkMode();
  }
  if (cur == 'dark') {
    darkmode_button.innerHTML = sun;
  } else {
    darkmode_button.innerHTML = moon;
  }
};

const invert = {
  'dark': 'light',
  'light': 'dark'
};

export const toggleDarkMode = () => {

  let cur = LS.get(modeKey);

  if (valid[cur]) {
    // 从 localStorage 中读取模式，并取相反的模式
    cur = invert[cur];
  } else if (cur === null) {
    // localStorage 中没有相关值，或者 localStorage 抛了 Error
    // 从 CSS 中读取当前 prefers-color-scheme 并取相反的模式
    cur = invert[getModeFromCSS()];
  } else {
    return; // 不知道出了什么幺蛾子，比如 localStorage 被篡改成非法值
  }
  // 将相反的模式写入 localStorage
  LS.set(modeKey, cur);

  return cur;
};
const set = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch (e) { }
}
const remove = (k) => {
  try {
    localStorage.removeItem(k);
  } catch (e) { }
}
const get = (k) => {
  try {
    return localStorage.getItem(k);
  } catch (e) {
    return null // 与 localStorage 中没有找到对应 key 的行为一致
  }
}

module.exports = {
  set,
  remove,
  get
}
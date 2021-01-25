const { toCharArray } = require('./utils');

const i2c = 'abcdefghijklmnopqrstuvwxyz0123456789.,';
const c2i = ((arr) => {
  let obj = {};
  arr.forEach((val, idx) => {
    obj[val] = idx;
  });
  return obj;
})(toCharArray(i2c));
const sz = i2c.length;

module.exports = {
  i2c,
  c2i,
  sz,
};
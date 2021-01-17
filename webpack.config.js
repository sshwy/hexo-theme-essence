const webpack = require('webpack');

module.exports = {
  entry: [
    './js/browser-type.js',
    './js/crypt.js',
    './js/rtc.js',
    //'./js/search.js',
    './js/cookie.js',
    './js/ssimple.js'
  ],
  output: {
    filename: 'script.bundle.js',
    path: 'js/',
  },
  mode: 'production',
  plugins: [
    //new webpack.ProvidePlugin({
    //  $: 'jquery',
    //  jQuery: 'jquery',
    //}),
  ]
};

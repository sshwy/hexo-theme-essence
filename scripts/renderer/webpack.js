'use strict';
/* global hexo */

const webpack = require('webpack');
const MemoryFS = require('memory-fs');

const { tmpdir } = require('os');
const { join, basename, resolve: pathResolve, relative, sep: pathSep } = require('path');

const { tiferr } = require('iferr');

const TMP_PATH = tmpdir();
const mfs = new MemoryFS();

const entry_name = 'ssimple.js';

/**
 * @param {string} entry
 * @param {Hexo} ctx
 */
const webpackInmemoryRenderAsync = (entry, ctx) => {
  /** @type {webpack.Configuration} */
  const config = {
    entry: entry,
    mode: 'production',
    output: {
      path: TMP_PATH,
      filename: basename(entry),
    },
    plugins: [
      new webpack.DefinePlugin({
        HEXO_THEME_CONFIG: JSON.stringify(hexo.theme.config)
      }),
    ]
  };

  const outputPath = join(config.output.path, config.output.filename);

  const compiler = webpack(config);
  compiler.outputFileSystem = mfs;

  return new Promise((resolve, reject) => {
    compiler.run(tiferr(reject, stats => {
      if (stats.hasErrors()) {
        ctx.log.error(stats.toString());
        throw new Error(stats.toJson('errors-only').errors.join('\n'));
      }

      if (stats.hasWarnings()) {
        ctx.log.warn(stats.toString());
      }

      resolve(mfs.readFileSync(outputPath, 'utf8'));
    }));
  });
};

function isPathInside (childPath, parentPath) {
  const relation = relative(parentPath, childPath);

  return Boolean(
    relation &&
    relation !== '..' &&
    !relation.startsWith(`..${pathSep}`) &&
    relation !== pathResolve(childPath)
  );
}

hexo.extend.filter.register('after_generate', function () { // remove route of non entry js files
  hexo.route.list()
    .filter(path => /^js.module.(.*?)\.js$/.test(path) && basename(path) !== entry_name)
    .forEach(path => {
      hexo.route.remove(path);
      hexo.log.debug(`[hexo-theme-essence] Trim ${path}`);
    });
  hexo.log.info('[hexo-theme-essence] Trim non-entry javascript files.');
});

hexo.extend.renderer.register('js', 'js', function ({ path }) {
  const THEME_SOURCE_DIR = pathResolve(hexo.theme_dir, 'source');

  if (isPathInside(path, THEME_SOURCE_DIR) && basename(path) === entry_name) {
    hexo.log.debug(`[hexo-theme-essence] Webpack entry: ${path}`);
    return webpackInmemoryRenderAsync(path, this);
  }

  return '';
});
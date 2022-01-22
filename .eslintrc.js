module.exports = {
  env: {
    'browser': true,
    'es2021': true,
    'commonjs': true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  rules: {
    'indent': [
      'error',
      2,
      { SwitchCase: 1 }
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ]
  }
};

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'no-undef': 'off',
    'semi':['warn','always'],
    'space-before-function-paren': 0,
    'no-const-assign': 'warn',
    'no-this-before-super': "warn",
    'no-undef': "warn",
    'no-unreachable': 'warn',
    'no-unused-vars': 'warn',
    'constructor-super': 'warn',
    'valid-typeof': 'warn',
    'no-trailing-spaces':['warn',{ "skipBlankLines": true,"ignoreComments": true }],
    'keyword-spacing':['warn',{"before": true,'after': true}],
    'space-infix-ops':0,
    'eqeqeq': 0,
    'space-before-blocks': ['warn','always'],
    'indent': 0,
    'quotes': ['warn','single']
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}

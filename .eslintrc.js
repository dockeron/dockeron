module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // no console
    'no-console': 2,
    'no-new-object': 2,
    'quote-props': ["error", "as-needed"],
    "object-shorthand": ["error", "always"],
    'no-array-constructor': 2,
    'array-callback-return': 2,
    'prefer-template': 2,
    // not assign to const
    'no-const-assign': 2
    // no var, use let and const
    // 'no-var': 1
  }
}

module.exports = {
  "env": {
    'commonjs': true,
    'es2021': true,
    'node': true,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12,
  },
  'rules': {
    'no-sparse-arrays': 'off',
    'comma-dangle': [ 'error', 'always-multiline' ],
    'eol-last': [ 'error', 'always' ],
  },
};

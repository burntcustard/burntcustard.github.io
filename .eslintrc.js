module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "settings": {
    "react": {
      "version": "detect",
    },
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
};

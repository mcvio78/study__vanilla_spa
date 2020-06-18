module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "node": true,
    "es6": true,
    "jquery": true
  },
  "extends": "eslint:recommended",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "no-console": 0,
    "quotes": [1, "single", { "avoidEscape": true }],
    "semi": 1,
    "no-useless-escape": 0,
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }]
  }
};

module.exports = {
	"env": {
		"browser": true,
		"node": true,
		"es6": true
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
		"no-useless-escape": 0,
		"semi": 1
	}
};

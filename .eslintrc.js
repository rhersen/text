module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    globals: {
        require: false,
        module: true,
        _: true,
        describe: false,
        expect: false,
        jest: false,
        it: false,
        Buffer: false
    },
    "extends": "cleanjs",
    "parserOptions": {
        "sourceType": "module"
    },
    "plugins": [],
    "rules": {
        "complexity": ["error", 5],
        "eqeqeq": ["error"],
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "max-depth": ["error", 2],
        "max-params": ["error", 4],
        "max-statements": ["error", 23],
        "no-extra-parens": ["error"],
        "no-shadow": ["error"],
        "quotes": ["error", "single", { "avoidEscape": true }],
        "semi": ["error", "never"],
        "no-unused-vars": "off"
    }
};
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
        "linebreak-style": ["error", "unix"]
    }
};
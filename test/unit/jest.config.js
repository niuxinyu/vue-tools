const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, '../../'),
    moduleFileExtensions: [
        "js",
        "ts",
        "json",
        // "vue"
    ],
    transform: {
        '\\.js$': 'babel-jest',
        "\\.(ts)$": "ts-jest",
        // ".*\\.(vue)$": "vue-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    moduleNameMapper: {
        '@/(.*)$': '<rootDir>/src/$1'
    }
};

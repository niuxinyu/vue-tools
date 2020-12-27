module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        'plugin:vue/essential',
        'airbnb-base',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: [
        'vue',
        '@typescript-eslint',
    ],
    rules: {
        'object-curly-spacing': [2, 'always'],
        'space-before-blocks': 2,
        // 不规则的空白不允许
        'no-irregular-whitespace': 2,
        // 一行结束后面不允许有空格
        'no-trailing-spaces': 2,
        // 语句强制分号结尾
        semi: [2, 'always'],
        // 函数括号前后必须有空格
        'space-before-function-paren': ['error', 'always'],
        // 要求文件末尾保留一行空行
        'eol-last': 'error',
        // if else 等语句的换行规则 报错 必须换行
        'brace-style': ['error', 'stroustrup'],
        // 不强制要求驼峰
        camelcase: 0,
        // 缩进风格
        indent: ['error', 4],
        // 换行符风格
        'linebreak-style': ['error', 'windows'],
        // 允许引入任何包
        'import/no-extraneous-dependencies': 0,
        // import 不必包含空行
        'import/newline-after-import': 0,
        'class-methods-use-this': 0,
        // ts
        // 允许在ts内使用var和require
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/ban-ts-ignore': 0,
        '@typescript-eslint/camelcase': 0,
        // 更多规则 https://cn.eslint.org/docs/rules/
    },
};

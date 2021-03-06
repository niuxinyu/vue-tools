module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  parser: 'vue-eslint-parser',
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
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
    indent: ['error', 2],
    // 换行符风格 允许为CRLF或LF
    'linebreak-style': 0,
    // 允许引入任何包
    'import/no-extraneous-dependencies': 0,
    // import 不必包含空行
    'import/newline-after-import': 0,
    'class-methods-use-this': 0,
    // 允许非默认导出
    'import/prefer-default-export': 0,
    // 不强制解构优先
    'prefer-destructuring': 0,
    // 允许 for in
    'no-restricted-syntax': 0,
    // 允许对函数参数重新赋值
    'no-param-reassign': 0,
    // 允许返回语句赋值
    'no-return-assign': 0,
    // 允许 ++ --
    'no-plusplus': 0,
    // 允许空 return
    'no-useless-return': 0,
    // 允许 arguments
    'prefer-rest-params': 0,
    // 不限制行的最长字符
    'max-len': 0,
    // 允许字符串拼接
    'prefer-template': 0,
    // 允许连续生命变量
    'one-var': 0,
    // 允许下划线命名函数
    'no-underscore-dangle': 0,
    // 允许可能是错误的表达式
    'no-unused-expressions': 0,
    // 允许连接变量赋值
    'no-multi-assign': 0,
    // 允许位运算
    'no-bitwise': 0,
    // switch 可以不使用default
    'default-case': 0,
    // 更多规则 https://cn.eslint.org/docs/rules/
    // 解决
    // ESLint: Missing file extension "ts" for "./components/preview/index"(import/extensions)
    // 错误
    'import/extensions': 'off',
    'padded-blocks': 'off',
    // 不要检查正则中多余的转义符
    'no-useless-escape': 'off',
    // 允许局部变量名字覆盖全局变量名
    'no-shadow': 0,
    // 允许代码中的任意地方执行require
    'global-require': 0,
    // 允许嵌套、连用三元表达式
    'no-nested-ternary': 0,
    // ts
    // 允许在ts内使用var和require
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/camelcase': 0,
    // 允许为this设置别名
    '@typescript-eslint/no-this-alias': 0,
    // 不强制要求函数必须写返回值
    '@typescript-eslint/explicit-module-boundary-types': 0,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json', '.d.ts'],
      },
    },
  },
};

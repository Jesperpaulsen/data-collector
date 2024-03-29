module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'react-app',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier-standard'
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
    'prettier',
    'simple-import-sort'
  ],
  rules: {
    'no-case-declarations': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-use-before-define': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Node.js builtins.
          [
            '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)'
          ],
          // Packages
          ['^\\w'],
          // Internal packages.
          ['^(@|config/)(/*|$)'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s?css$']
        ]
      }
    ],
    'no-unused-vars': 'off'
  },
  globals: {
    chrome: true
  }
}

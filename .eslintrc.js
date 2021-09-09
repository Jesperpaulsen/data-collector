module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/essential', 'standard', 'plugin:prettier/recommended', "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {},
};

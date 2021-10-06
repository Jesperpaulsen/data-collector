const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    safeList: [],
    content: ['./index.html', './src/**/*.jsx', './src/**/*.js', './src/**/*.tsx'],
  },
  theme: {
    extend: {
      fontWeight: ['hover', 'focus'],
      fontFamily: {
        sans: '"Trebuchet MS", "Lucida Grande", sans-serif',
      },
    },
  },
  variants: {},
  plugins: [],
};

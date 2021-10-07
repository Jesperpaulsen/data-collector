const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    safeList: [],
    content: [
      './index.html',
      './src/**/*.jsx',
      './src/**/*.js',
      './src/**/*.tsx'
    ]
  },
  theme: {
    extend: {
      fontWeight: ['hover', 'focus'],
      fontFamily: {
        sans: '"Trebuchet MS", "Lucida Grande", sans-serif'
      },
      colors: {
        primary: '#6B955C',
        secondary: '#E5E2E2'
      }
    }
  },
  variants: {},
  plugins: []
}

import preactRefresh from '@prefresh/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: `import { h } from 'preact'`,
    minify: false
  },
  plugins: [preactRefresh()],
  build: {
    outDir: './dist',
    rollupOptions: {
      external: ['@data-collector/types']
    }
  },
  resolve: {
    alias: {
      tslib: 'tslib/tslib.es6.js',
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react/jsx-runtime': 'preact/jsx-runtime'
    }
  }
})

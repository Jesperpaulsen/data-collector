import preactRefresh from '@prefresh/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: `import { h } from 'preact'`
  },
  plugins: [preactRefresh()],
});

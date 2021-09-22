const { build } = require('esbuild')

const options = {
  entryPoints: [
    './src/injected-fetch.ts',
    './src/injected-xhr.ts',
    './src/content-script.ts',
    './src/wrapper.ts'
  ],
  format: 'iife',
  bundle: true,
  sourcemap: true,
  outdir: '../../dist',
  target: ['chrome58'],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
}

build(options).catch(() => process.exit(1))

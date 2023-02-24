import {chrome} from '../../electron-vendors.config.json';
import copy from 'rollup-plugin-copy'
import {join} from 'path';
import {builtinModules} from 'module';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/'
    },
  },
  build: {
    sourcemap: false,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: false,
    lib: {
      entry: 'src/index.js',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: [
        'electron',
        ...builtinModules,
      ],
      output: {
        entryFileNames: '[name].cjs'
      }
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },

};

export default config;

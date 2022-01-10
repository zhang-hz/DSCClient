/* eslint-env node */

import {chrome, node} from '../../electron-vendors.config.json';
import {join , resolve} from 'path';
import {builtinModules} from 'module';
import vue from '@vitejs/plugin-vue';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  plugins: [vue()],
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: false,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    minify:false,
    rollupOptions: {
      input: {
        main: resolve(PACKAGE_ROOT, 'index.html'),
        helper: resolve(PACKAGE_ROOT, 'helper.html')
      },
      external: [
        'electron',
        ...builtinModules,
      ],
    },
    emptyOutDir: true,
    brotliSize: false,
  },
};

export default config;

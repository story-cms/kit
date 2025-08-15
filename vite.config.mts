import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import path from 'node:path';

// TODO: https://github.com/vitejs/vite/discussions/8483#discussioncomment-13411070
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: 'tsconfig.frontend.json',
    }),
  ],
  build: {
    outDir: 'dist/frontend',
    sourcemap: 'inline',
    cssCodeSplit: true,
    lib: {
      entry: {
        main: path.resolve(__dirname, 'src/frontend/index.ts'),
        styles: path.resolve(__dirname, 'src/frontend/index.css'),
      },
      formats: ['es'],
      // name: 'Ui',
      // fileName: 'index',
    },
    rollupOptions: {
      external: [
        'axios',
        'luxon',
        'pinia',
        'vue',
        '@adonisjs/auth',
        '@adonisjs/lucid',
        '@google-analytics/data',
        '@vinejs/vine',
        'firebase-admin',
        'openai',
        'zod',
      ],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import fs from 'node:fs';
import path from 'node:path';

const uiTypesEntryPath = path.resolve(__dirname, 'dist/frontend/main.d.ts');

/** Re-export generated declarations at the same path as the JS entry (main.js). */
function uiTypesEntry() {
  return {
    name: 'ui-types-entry',
    closeBundle() {
      fs.writeFileSync(uiTypesEntryPath, "export * from './src/frontend/index';\n");
    },
  };
}

// TODO: https://github.com/vitejs/vite/discussions/8483#discussioncomment-13411070
export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: 'tsconfig.frontend.json',
    }),
    uiTypesEntry(),
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
        '@adonisjs/core',
        '@adonisjs/lucid',
        '@adonisjs/session',
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

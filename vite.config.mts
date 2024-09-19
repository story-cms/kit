import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
    // cleaner import statements
    tsconfigPaths(),
  ],
  build: {
    sourcemap: 'inline',
    cssCodeSplit: true,
    lib: {
      entry: {
        main: path.resolve(__dirname, 'src/index.ts'),
        styles: path.resolve(__dirname, 'src/index.css'),
      },
      formats: ['es'],
      name: 'Ui',
      fileName: 'ui',
    },
    rollupOptions: {
      external: [
        '@aws-sdk/client-s3',
        '@aws-sdk/lib-storage',
        '@rive-app/canva',
        'axios',
        'easymde',
        'luxon',
        'pinia',
        'vue',
      ],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    sourcemap: 'inline',
    cssCodeSplit: true,
    lib: {
      entry: {
        main: path.resolve(__dirname, 'src/index.ts'),
        styles: path.resolve(__dirname, 'src/index.css'),
      },
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

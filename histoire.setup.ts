import './src/frontend/index.css';

import { defineSetupVue3 } from '@histoire/plugin-vue';
// import { pinia, useWidgetsStore } from './src/store';
import { pinia } from './src/frontend/store';

// const widgets = useWidgetsStore(pinia);
// widgets.setProviders({
//   s3: {
//     accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID,
//     accessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
//     bucket: import.meta.env.VITE_S3_BUCKET,
//     region: import.meta.env.VITE_S3_REGION,
//     endpoint: import.meta.env.VITE_S3_ENDPOINT,
//   },
//   cloudinary: {
//     apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
//     secret: import.meta.env.VITE_CLOUDINARY_SECRET,
//     cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
//     defaultPreset: import.meta.env.VITE_CLOUDINARY_PRESET,
//   },
//   scripture: {
//     bibleApiKey: import.meta.env.VITE_BIBLE_API_KEY,
//   },
// });

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.use(pinia);
});

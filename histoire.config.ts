import { defineConfig } from 'histoire';
import { HstVue } from '@histoire/plugin-vue';

export default defineConfig({
  plugins: [HstVue()],
  setupFile: 'histoire.setup.ts',
  viteNodeInlineDeps: [/@aws-sdk/, /@inertiajs/],
  tree: {
    groups: [
      {
        id: 'top',
        title: '', // No toggle
      },
      {
        id: 'widgets',
        title: 'Field Widgets',
      },
      {
        id: 'chapter',
        title: 'Chapter Index',
      },
      {
        id: 'draft',
        title: 'Drafts',
      },
      {
        id: 'pages',
        title: 'Pages',
      },
      {
        id: 'interface',
        title: 'Interface',
      },
      {
        id: 'users',
        title: 'Users',
      },
      {
        id: 'shared',
        title: 'Shared Widgets',
      },
    ],
  },
  theme: {
    title: 'Story CMS',
    //   logo: {
    //     square: "./img/square.png",
    //     light: "./img/light.png",
    //     dark: "./img/dark.png",
    //   },
    //   logoHref: "https://acme.com",
    //   favicon: "./favicon.ico",
  },
});

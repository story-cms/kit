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
        id: 'dashboard',
        title: 'Dashboard',
      },
      {
        id: 'stories',
        title: 'Stories',
      },
      {
        id: 'streams',
        title: 'Streams',
      },
      {
        id: 'pages',
        title: 'Pages',
      },
      {
        id: 'interface',
        title: 'UI',
      },
      {
        id: 'team',
        title: 'Team',
      },
      {
        id: 'shared',
        title: 'Shared',
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

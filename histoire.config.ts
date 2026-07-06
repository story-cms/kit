import { defineConfig } from 'histoire';
import { HstVue } from '@histoire/plugin-vue';
import type { Plugin } from 'vite';

function splitLargeVendors(id: string): string | undefined {
  if (!id.includes('node_modules')) return undefined;

  if (id.includes('@rive-app')) return 'vendor-rive';
  if (id.includes('easymde') || id.includes('codemirror')) return 'vendor-easymde';
  if (id.includes('@shikijs/langs') || id.includes('shiki/dist/langs'))
    return 'vendor-shiki-langs';
  if (id.includes('@shikijs/themes')) return 'vendor-shiki-themes';
  if (id.includes('shiki') || id.includes('@shikijs')) return 'vendor-shiki-core';

  return undefined;
}

function chunksPlugin(): Plugin {
  return {
    name: 'split-vendor-chunks',
    enforce: 'post',
    configResolved(config) {
      const output = config.build.rollupOptions.output;
      const applyChunks = (o: Record<string, any>) => {
        const existing = typeof o.manualChunks === 'function' ? o.manualChunks : null;
        o.manualChunks = (id: string, api: any) => {
          const result = splitLargeVendors(id);
          if (result) return result;
          if (existing) return existing(id, api);
        };
      };
      if (Array.isArray(output)) {
        for (const o of output) applyChunks(o);
      } else if (output && typeof output === 'object') {
        applyChunks(output);
      }
    },
  };
}

export default defineConfig({
  plugins: [HstVue()],
  setupFile: 'histoire.setup.ts',
  viteNodeInlineDeps: [/@aws-sdk/, /@inertiajs/],
  vite: {
    plugins: [chunksPlugin()],
  },
  tree: {
    groups: [
      {
        id: 'top',
        title: '', // No toggle
      },
      {
        id: 'dashboard',
        title: 'Dashboard',
      },
      {
        id: 'widgets',
        title: 'Field Widgets',
      },
      {
        id: 'invitation',
        title: 'Invitation',
      },
      {
        id: 'pages',
        title: 'Pages',
      },
      {
        id: 'resources',
        title: 'Resources',
      },
      {
        id: 'settings',
        title: 'Settings',
      },
      {
        id: 'shared',
        title: 'Shared',
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
        id: 'team',
        title: 'Team',
      },
      {
        id: 'interface',
        title: 'UI',
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

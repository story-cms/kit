import { defineConfig } from 'histoire';
import { HstVue } from '@histoire/plugin-vue';
import type { Plugin } from 'vite';

function manualChunks(id: string) {
  if (!id.includes('node_modules')) return;

  if (id.includes('@rive-app')) return 'vendor-rive';
  if (id.includes('easymde') || id.includes('codemirror'))
    return 'vendor-easymde';
  if (
    id.includes('@aws-sdk') ||
    id.includes('@smithy') ||
    id.includes('@aws-crypto')
  )
    return 'vendor-aws';
  if (id.includes('@shikijs/langs') || id.includes('shiki/dist/langs'))
    return 'vendor-shiki-langs';
  if (id.includes('@shikijs/themes')) return 'vendor-shiki-themes';
  if (
    id.includes('shiki') ||
    id.includes('@shikijs') ||
    id.includes('histoire') ||
    id.includes('@histoire') ||
    id.includes('@shikijs/core')
  )
    return 'vendor-shiki-core';

  const match = id.match(/node_modules\/(@[^/]+\/[^/]+|[^/]+)/);
  if (match) return 'vendor-' + match[1].replace(/[@/]/g, '-');

  return 'vendor';
}

function chunksPlugin(): Plugin {
  return {
    name: 'split-vendor-chunks',
    enforce: 'post',
    configResolved(config) {
      const output = config.build.rollupOptions.output;
      if (Array.isArray(output)) {
        for (const o of output) {
          o.manualChunks = manualChunks;
        }
      } else if (output && typeof output === 'object') {
        output.manualChunks = manualChunks;
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
        id: 'campaign',
        title: 'Campaign',
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

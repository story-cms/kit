<template>
  <Story title="Index Page" group="pages">
    <Variant title="Index" :setup-app="miniSidebar">
      <PagesIndex
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :stories="['John', 'Acts']"
        :pages="pages"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PagesIndex from './pages-index.vue';
import { sharedProps, miniSidebar } from '../../frontend/test/mocks';
import type { PageItem } from '../../types';

const pages: PageItem[] = [
  {
    id: 1,
    title: 'About Us',
    description: 'What we are all about',
    icon: 'https://res.cloudinary.com/journeys/image/upload/v1756122183/aatrg9bikextwwun4vb2_kblpui.svg',
    body: '## About Us\n\nWe are a group of people who love Jesus and want to share his love with others.',
    isPublished: true,
    isDivider: false,
  },
];
</script>

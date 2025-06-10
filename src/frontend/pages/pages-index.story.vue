<template>
  <Story title="Index Page" group="pages">
    <Variant title="Index">
      <PagesIndex
        :pages="pages"
        :errors="sharedProps.errors"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :stories="['John', 'Acts']"
        :ui-todo-count="0"
        :story-name="sharedProps.storyName"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PagesIndex from './pages-index.vue';
import { sharedProps } from '../../frontend/test/mocks';
import type { PageItem } from '../../types';

const pages: PageItem[] = [
  {
    id: 1,
    title: 'About Us',
    description: 'What we are all about',
    icon: 'https://res.cloudinary.com/onesheep/image/upload/v1684417825/cmsplayground/aatrg9bikextwwun4vb2.svg',
    body: '## About Us\n\nWe are a group of people who love Jesus and want to share his love with others.',
    isPublished: true,
    isDivider: false,
  },
];
</script>

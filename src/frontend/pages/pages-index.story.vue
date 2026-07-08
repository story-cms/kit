<template>
  <Story title="Index Page" group="pages">
    <Variant title="Index" :setup-app="miniSidebar">
      <PagesIndex
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :pages="pages"
      />
    </Variant>
    <Variant title="Pages without titles" :setup-app="miniSidebar">
      <PagesIndex
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :pages="pagesWithoutTitles"
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
  {
    id: 2,
    title: 'Contact Us',
    description: 'How to contact us',
    icon: 'https://res.cloudinary.com/journeys/image/upload/v1756122183/aatrg9bikextwwun4vb2_kblpui.svg',
    body: '## Contact Us\n\nYou can contact us by email at info@journeys.com.',
    isPublished: true,
    isDivider: false,
  },
  {
    id: 4,
    isDivider: true,
    isPublished: true,
  },
  {
    id: 3,
    title: 'Privacy Policy',
    description: 'Our privacy policy',
    icon: 'https://res.cloudinary.com/journeys/image/upload/v1756122183/aatrg9bikextwwun4vb2_kblpui.svg',
    body: '## Privacy Policy\n\nWe respect your privacy and will not share your information with anyone.',
    isPublished: true,
    isDivider: false,
  },
];

const pagesWithoutTitles: PageItem[] = [
  {
    id: 1,
    title: '',
    description: '',
    icon: 'https://res.cloudinary.com/journeys/image/upload/v1756122183/aatrg9bikextwwun4vb2_kblpui.svg',
    body: '',
    isPublished: false,
    isDivider: false,
  },
  {
    id: 2,
    title: '',
    description: '',
    icon: '',
    body: '',
    isPublished: false,
    isDivider: false,
  },
];
</script>

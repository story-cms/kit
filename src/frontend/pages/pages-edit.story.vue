<template>
  <Story title="Pages Edit" group="pages">
    <Variant title="With model" :setup-app="miniSidebar">
      <PagesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :bundle="pageBundle"
        :page="page"
        :providers="{}"
      />
    </Variant>

    <Variant title="Already published" :setup-app="miniSidebar">
      <PagesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :bundle="publishedPageBundle"
        :page="publishedPage"
        :providers="{}"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PagesEdit from './pages-edit.vue';
import type { PageBundle, PageMeta } from '../../types';
import { sharedProps, miniSidebar } from '../../frontend/test/mocks';

const pageBundle: PageBundle = {
  group: 1,
  title: 'About Us',
  description: 'About us page',
  body: '## Welcome!\nWe hope you enjoy this site.',
  icon: 'https://res.cloudinary.com/journeys/image/upload/v1756122183/aatrg9bikextwwun4vb2_kblpui.svg',
};

const page: PageMeta = {
  id: 1,
  createdAt: '2021-10-10T14:48:00.000000Z',
  updatedAt: '2021-10-10T14:48:00.000000Z',
};

const publishedPageBundle = {
  ...pageBundle,
  isPublished: true,
  type: 'text',
  category: 'General',
};

const publishedPage: PageMeta = {
  id: 1,
  createdAt: '2021-10-10T14:48:00.000000Z',
  updatedAt: '2024-06-15T09:30:00.000000Z',
};
</script>

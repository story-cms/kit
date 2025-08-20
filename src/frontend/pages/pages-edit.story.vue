<template>
  <Story title="Pages Edit" group="pages">
    <Variant title="With model" :setup-app="miniSidebar">
      <PagesEdit
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :stories="['John', 'Acts']"
        :bundle="pageBundle"
        :page="page"
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
  icon: 'https://res.cloudinary.com/onesheep/image/upload/v1684417825/cmsplayground/aatrg9bikextwwun4vb2.svg',
};

const page: PageMeta = {
  id: 1,
  createdAt: '2021-10-10T14:48:00.000000Z',
  updatedAt: '2021-10-10T14:48:00.000000Z',
};
</script>

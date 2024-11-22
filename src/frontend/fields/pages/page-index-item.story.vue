<template>
  <Story title="Page Index Item" group="pages">
    <Variant title="With model">
      <PageIndexItem :page="page" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import type { PageItem } from '../../../interfaces';
import PageIndexItem from './page-index-item.vue';

const page = {
  id: 1,
  group: 1,
  title: 'Example 1',
  icon: 'https://res.cloudinary.com/onesheep/image/upload/v1684417825/cmsplayground/aatrg9bikextwwun4vb2.svg',
  description: 'This is the first',
  body: 'We have the first body',
  isPublished: true,
  isDivider: false,
} as PageItem;
</script>

<docs lang="md">
# Number Field
</docs>

<template>
  <Story title="Page Index Item" group="pages">
    <Variant title="With model">
      <PageIndexItem :page="page" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import type { PageItem } from '../../types';
import PageIndexItem from './page-index-item.vue';

const page = {
  id: 1,
  group: 1,
  title: 'Example 1',
  icon: 'https://res.cloudinary.com/journeys/image/upload/v1756122183/aatrg9bikextwwun4vb2_kblpui.svg',
  description: 'This is the first',
  body: 'We have the first body',
  isPublished: true,
  isDivider: false,
} as PageItem;
</script>

<docs lang="md">
# Number Field
</docs>

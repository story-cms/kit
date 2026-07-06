<template>
  <Story title="Page Index Item" group="pages" :layout="{ type: 'grid', width: 720 }">
    <Variant title="Published page">
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white divide-y divide-gray-100"
      >
        <PageIndexItem :page="publishedPage" @tap="onTap" />
      </div>
    </Variant>

    <Variant title="Unpublished page">
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white divide-y divide-gray-100"
      >
        <PageIndexItem :page="unpublishedPage" @tap="onTap" />
      </div>
    </Variant>

    <Variant title="Link page">
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white divide-y divide-gray-100"
      >
        <PageIndexItem :page="linkPage" @tap="onTap" />
      </div>
    </Variant>

    <Variant title="Divider">
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white divide-y divide-gray-100"
      >
        <PageIndexItem :page="dividerPage" @remove-divider="onRemoveDivider" />
      </div>
    </Variant>

    <Variant title="Dragging">
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white divide-y divide-gray-100"
      >
        <PageIndexItem :page="publishedPage" :is-dragging="true" @tap="onTap" />
      </div>
    </Variant>

    <Variant title="Full list">
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white divide-y divide-gray-100"
      >
        <PageIndexItem :page="publishedPage" @tap="onTap" />
        <PageIndexItem :page="dividerPage" @remove-divider="onRemoveDivider" />
        <PageIndexItem :page="linkPage" @tap="onTap" />
        <PageIndexItem :page="unpublishedPage" @tap="onTap" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import type { PageItem } from '../../types';
import PageIndexItem from './page-index-item.vue';

const icon =
  'https://res.cloudinary.com/journeys/image/upload/v1756122183/aatrg9bikextwwun4vb2_kblpui.svg';

const publishedPage: PageItem = {
  id: 1,
  group: 1,
  title: 'About Us',
  icon,
  description: 'Learn more about our mission and team',
  body: 'We have the first body',
  isPublished: true,
  isDivider: false,
};

const unpublishedPage: PageItem = {
  id: 2,
  group: 1,
  title: 'Draft Page',
  icon,
  description: 'This page is not yet published',
  body: 'Draft content',
  isPublished: false,
  isDivider: false,
};

const linkPage: PageItem = {
  id: 3,
  group: 1,
  title: 'External Link',
  icon,
  description: 'Opens an external website',
  body: 'https://example.com',
  isPublished: true,
  isDivider: false,
};

const dividerPage: PageItem = {
  id: 4,
  isDivider: true,
  isPublished: true,
};

const onTap = (id: number) => {
  alert(`Edit page ${id}`);
};

const onRemoveDivider = () => {
  alert('Remove divider');
};
</script>

<docs lang="md">
# Page Index Item

List row for a page in the pages index. Supports drag-to-reorder (published pages and dividers), tap-to-edit, and divider removal.
</docs>

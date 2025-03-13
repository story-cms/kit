<template>
  <Story title="Index Filter" group="shared">
    <Variant title="With tabs">
      <IndexFilter :tabs="tabItems" :current-tab="currentTab" @change="changeTab" />
      <div class="text-white">{{ currentTab }}</div>
    </Variant>
    <Variant title="No tabs">
      <IndexFilter :tabs="noItems" :current-tab="currentTab" @change="changeTab" />
    </Variant>
    <Variant title="Light mode">
      <div class="bg-white">
        <IndexFilter :tabs="tabItems" :current-tab="currentTab" @change="changeTab" />
      </div>
    </Variant>
    <Variant title="Demo">
      <IndexFilter :tabs="tabItems" :current-tab="currentTab" @change="changeTab" />
      <div v-for="page in filteredItems" :key="page.id" class="bg-white">
        <PageIndexItem :page="page" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import IndexFilter from './index-filter.vue';
import type { TabItem, PageItem } from '../../types';
import { ref, computed } from 'vue';
import PageIndexItem from '../pages/page-index-item.vue';

const items = ref<PageItem[]>([
  {
    id: 1,
    group: 1,
    title: 'Example 1',
    icon: 'https://res.cloudinary.com/onesheep/image/upload/v1684417825/cmsplayground/aatrg9bikextwwun4vb2.svg',
    description: 'This is the first',
    body: 'We have the first body',
    isPublished: true,
    isDivider: false,
  },
  {
    id: 2,
    group: 1,
    title: 'Example 2',
    icon: 'https://res.cloudinary.com/onesheep/image/upload/v1684417788/cmsplayground/rjafxc8geku5dk8cziij.svg',
    description: 'This is the second',
    body: 'We have the second body',
    isPublished: true,
    isDivider: false,
  },
  {
    id: 3,
    group: 1,
    title: 'Example 3',
    icon: 'https://res.cloudinary.com/onesheep/image/upload/v1684487225/cmsplayground/xfnravnfxahbjen6xebw.svg',
    description: 'This is the third',
    body: 'We have the third body',
    isPublished: false,
    isDivider: false,
  },
]);

const isShowingPublished = computed(() => currentTab.value === 'Published');

const filteredItems = computed(() => {
  if (isShowingPublished.value) {
    return items.value.filter((item) => item.isPublished || item.isDivider);
  }
  if (currentTab.value === 'All') {
    return items.value;
  }
  return items.value.filter((item) => !item.isPublished);
});

const currentTab = ref('All');

const changeTab = (tab: string) => {
  currentTab.value = tab;
};

const noItems: TabItem[] = [];
const tabItems: TabItem[] = [
  {
    label: 'All',
    count: 3,
  },
  {
    label: 'Published',
    count: 2,
  },
  {
    label: 'Drafts',
    count: 1,
  },
];
</script>

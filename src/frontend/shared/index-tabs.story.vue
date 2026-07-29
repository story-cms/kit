<template>
  <Story title="Index Tabs" group="shared">
    <Variant title="Default">
      <IndexTabs :tabs="tabItems" :current-tab="currentTab" @change="changeTab" />
    </Variant>

    <Variant title="Interactive">
      <div class="space-y-4">
        <IndexTabs :tabs="tabItems" :current-tab="currentTab" @change="changeTab" />
        <p class="text-sm text-gray-600">Selected: {{ currentTab }}</p>
      </div>
    </Variant>

    <Variant title="On white background">
      <div class="rounded-xl bg-white p-6">
        <IndexTabs :tabs="publishedTabs" :current-tab="publishedTab" @change="changePublishedTab" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import IndexTabs from './index-tabs.vue';
import type { TabItem } from '../../types';

const currentTab = ref('To Do');

const changeTab = (tab: string) => {
  currentTab.value = tab;
};

const tabItems: TabItem[] = [
  { label: 'To Do', count: 6 },
  { label: 'Done', count: 2 },
];

const publishedTab = ref('Published');

const changePublishedTab = (tab: string) => {
  publishedTab.value = tab;
};

const publishedTabs: TabItem[] = [
  { label: 'Published', count: 12 },
  { label: 'Unpublished', count: 3 },
];
</script>

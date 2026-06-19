<template>
  <Story title="Navigation pane" group="shared">
    <Variant title="With icons">
      <NavigationPane :tabs="tabItems" :current-tab="currentTab" @change="changeTab" />
      <div class="mt-2 text-sm text-gray-600">Active: {{ currentTab }}</div>
    </Variant>
    <Variant title="Label only">
      <NavigationPane
        :tabs="labelOnlyTabs"
        :current-tab="currentTab"
        @change="changeTab"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavigationPane from './navigation-pane.vue';
import type { NavigationPaneTab } from '../../types';

const currentTab = ref('Details');

const changeTab = (tab: string) => {
  currentTab.value = tab;
};

const tabItems: NavigationPaneTab[] = [
  { label: 'Details', icon: 'book-open' },
  { label: 'Sections', icon: 'list-bullet' },
  { label: 'Resources', icon: 'folder' },
];

const labelOnlyTabs: NavigationPaneTab[] = [
  { label: 'Details' },
  { label: 'Sections' },
  { label: 'Resources' },
];
</script>

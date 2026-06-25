<template>
  <Story title="Tab navigation" group="shared">
    <Variant title="With icons">
      <TabNavigation :tabs="tabItems" :current-tab="currentTab" @change="changeTab" />
      <div class="mt-2 text-sm text-gray-600">Active: {{ currentTab }}</div>
    </Variant>

    <Variant title="Label only">
      <TabNavigation :tabs="labelOnlyTabs" :current-tab="currentTab" @change="changeTab" />
    </Variant>

    <Variant title="Settings style">
      <TabNavigation :tabs="settingsTabs" :current-tab="currentTab" @change="changeTab" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabNavigation from './tab-navigation.vue';
import type { NavigationPaneTab } from '../../types';

const currentTab = ref('Languages');

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

const settingsTabs: NavigationPaneTab[] = [
  { label: 'Account', icon: 'user' },
  { label: 'Team', icon: 'users' },
  { label: 'Languages', icon: 'translate' },
];
</script>

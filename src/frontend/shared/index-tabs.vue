<template>
  <nav aria-label="Filter tabs">
    <div class="inline-flex overflow-hidden rounded-full border border-gray-300">
      <IndexTabButton
        v-for="(tab, index) in tabs"
        :key="tab.label"
        :is-active="tab.current"
        :count="tab.count"
        :class="index === 0 ? 'border-r border-gray-300' : undefined"
        :aria-current="tab.current ? 'page' : undefined"
        @click="emit('change', tab.label)"
      >
        {{ tab.label }}
      </IndexTabButton>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TabItem } from '../../types';
import IndexTabButton from './index-tab-button.vue';

const props = defineProps({
  tabs: {
    type: Array<TabItem>,
    required: true,
  },
  currentTab: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['change']);

const tabs = computed(() =>
  props.tabs.map((tab: TabItem) => ({
    ...tab,
    current: tab.label === props.currentTab,
  })),
);
</script>

<template>
  <nav aria-label="Filter tabs">
    <div class="flex flex-wrap gap-1">
      <TabButton
        v-for="tab in tabs"
        :key="tab.label"
        :is-active="tab.current"
        :aria-current="tab.current ? 'page' : undefined"
        @click="emit('change', tab.label)"
      >
        {{ tab.label }}
        <span
          v-if="tab.count"
          class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
        >
          {{ tab.count }}
        </span>
      </TabButton>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TabItem } from '../../types';
import TabButton from './tab-button.vue';

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

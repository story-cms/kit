<template>
  <div class="flex">
    <button
      v-for="(tab, index) in tabs"
      :key="tab.label"
      type="button"
      :aria-current="tab.current ? 'page' : undefined"
      :class="[
        'relative inline-flex items-center px-4 py-2 text-sm font-medium leading-4 ring-1 ring-inset ring-gray-300 transition-all duration-75 hover:bg-gray-50 focus:z-10',
        index === 0 ? 'rounded-l-md' : 'rounded-r-md',
        tab.current
          ? 'bg-indigo-50 text-indigo-700 ring-indigo-700'
          : 'bg-white text-gray-900',
      ]"
      @click.prevent="emit('change', tab.label)"
    >
      {{ tab.label }}
      <span
        v-if="tab.count"
        class="inline-flex items-center px-2 py-1 ml-1 text-xs font-medium leading-4 text-indigo-700 bg-gray-100 rounded-full"
        >{{ tab.count }}</span
      >
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TabItem } from '../../types';

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

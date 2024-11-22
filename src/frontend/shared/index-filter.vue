<template>
  <div>
    <div class="sm:block">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.label"
            type="button"
            :class="[
              tab.current
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
              'flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
            ]"
            :aria-current="tab.current ? 'page' : undefined"
            @click.prevent="emit('change', tab.label)"
          >
            {{ tab.label }}
            <span
              v-if="tab.count"
              :class="[
                tab.current
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-100 text-gray-900',
                'ml-3 rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block',
              ]"
              >{{ tab.count }}</span
            >
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TabItem } from '../../interfaces';

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

<template>
  <nav class="border-b border-gray-200" aria-label="Section navigation">
    <div class="-mb-px flex flex-wrap gap-x-1">
      <button
        v-for="tab in tabs"
        :key="tab.label"
        type="button"
        :aria-current="tab.current ? 'page' : undefined"
        :class="[
          'relative inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium leading-none transition-colors duration-75',
          tab.current
            ? 'border-indigo-600 text-indigo-700'
            : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900',
        ]"
        @click.prevent="emit('change', tab.label)"
      >
        <span
          v-if="tab.icon"
          class="inline-flex h-5 w-5 shrink-0 items-center justify-center text-current [&_svg]:block [&_svg]:h-4 [&_svg]:max-h-full [&_svg]:w-4 [&_svg]:max-w-full"
        >
          <Icon :name="tab.icon" />
        </span>
        <span>{{ tab.label }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { NavigationPaneTab } from '../../types';
import Icon from './icon.vue';

const props = defineProps({
  tabs: {
    type: Array as PropType<NavigationPaneTab[]>,
    required: true,
  },
  currentTab: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['change']);

const tabs = computed(() =>
  props.tabs.map((tab: NavigationPaneTab) => ({
    ...tab,
    current: tab.label === props.currentTab,
  })),
);
</script>

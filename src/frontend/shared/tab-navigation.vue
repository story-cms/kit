<template>
  <nav aria-label="Tab navigation">
    <div class="flex flex-wrap gap-1">
      <TabButton
        v-for="tab in tabs"
        :key="tab.label"
        :label="tab.label"
        :is-active="tab.current"
        :has-error="tab.hasError"
        :aria-current="tab.current ? 'page' : undefined"
        @click="emit('change', tab.label)"
      >
        <Icon v-if="tab.icon" :name="tab.icon" aria-hidden="true" />
      </TabButton>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { NavigationPaneTab } from '../../types';
import Icon from './icon.vue';
import TabButton from './tab-button.vue';

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

const emit = defineEmits<{
  (e: 'change', tab: string): void;
}>();

const tabs = computed(() =>
  props.tabs.map((tab: NavigationPaneTab) => ({
    ...tab,
    current: tab.label === props.currentTab,
  })),
);
</script>

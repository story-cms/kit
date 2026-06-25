<template>
  <div
    class="flex items-center rounded-lg border border-gray-300 bg-white p-1"
    role="group"
    aria-label="View mode"
  >
    <button
      type="button"
      class="rounded-md p-2 transition-colors"
      :class="
        isList
          ? 'text-gray-500 hover:text-gray-700'
          : 'bg-gray-100 text-gray-900'
      "
      aria-label="Grid view"
      :aria-pressed="!isList"
      @click="selectGrid"
    >
      <LayoutGrid class="size-4" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="rounded-md p-2 transition-colors"
      :class="
        isList
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-500 hover:text-gray-700'
      "
      aria-label="List view"
      :aria-pressed="isList"
      @click="selectList"
    >
      <List class="size-4" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { LayoutGrid, List } from '@lucide/vue';

const props = defineProps<{
  isList: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle'): void;
}>();

const selectGrid = () => {
  if (props.isList) emit('toggle');
};

const selectList = () => {
  if (!props.isList) emit('toggle');
};
</script>

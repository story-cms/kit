<template>
  <button
    class="grid grid-cols-[1fr_auto] gap-x-4 w-full px-2 py-3 border-b border-gray-200"
  >
    <p class="text-left font-['Inter'] text-base leading-8 text-black font-medium">
      {{ props.item.source }}
    </p>
    <Icon class="size-4" name="sparkles" />
  </button>
</template>

<script setup lang="ts">
import type { UiItem } from '../../../types';
import Icon from '../../shared/icon.vue';
const props = defineProps<{
  item: UiItem;
}>();
</script>

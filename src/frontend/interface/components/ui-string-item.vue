<template>
  <button
    @click="$emit('click', item)"
    class="grid grid-cols-[1fr_auto] gap-x-4 w-full px-2 py-3 border-b border-gray-200"
  >
    <p
      class="text-left font-['Inter'] text-base leading-8 text-black font-medium line-clamp-1"
    >
      {{ item.source }}
    </p>
    <Icon class="size-4" name="sparkles" />
  </button>
</template>

<script setup lang="ts">
import type { UiItem } from '../../../types';
import Icon from '../../shared/icon.vue';

defineProps<{
  item: UiItem;
}>();

defineEmits<{
  click: [item: UiItem];
}>();
</script>

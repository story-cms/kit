<template>
  <button
    @click="$emit('click', item)"
    class="grid grid-cols-[1fr_auto] gap-x-4 w-full px-2 py-3 border-b border-gray-200"
    :class="{
      'bg-blue-500 ': isSelected,
    }"
  >
    <p
      class="text-left font-['Inter'] text-base leading-8 text-black font-medium line-clamp-1"
      :class="{
        'text-white': isSelected,
      }"
    >
      {{ item.source }}
    </p>
    <div class="flex items-center justify-center">
      <Icon v-if="isSelected" class="text-white h-[10px] w-auto" name="chevron-right" />
      <Icon v-else class="size-4 text-blue-500" name="sparkles" />
    </div>
  </button>
</template>

<script setup lang="ts">
import type { UiItem } from '../../../types';
import Icon from '../../shared/icon.vue';

defineProps<{
  item: UiItem;
  isSelected?: boolean;
}>();

defineEmits<{
  click: [item: UiItem];
}>();
</script>

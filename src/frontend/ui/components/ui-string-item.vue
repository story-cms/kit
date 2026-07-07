<template>
  <button
    class="grid w-full grid-cols-[1fr_auto] gap-x-4 border-b border-gray-200 px-2 py-3"
    :class="{
      'bg-blue-500': isSelected,
    }"
    @click="$emit('click', item)"
  >
    <p
      class="line-clamp-1 text-left font-dmsans text-base font-medium leading-8 text-black"
      :class="{
        'text-white': isSelected,
      }"
    >
      {{ item.source }}
    </p>
    <div class="flex items-center justify-center h-full">
      <ChevronRight
        v-if="isSelected"
        class="h-[10px] w-auto text-white"
        aria-hidden="true"
      />
      <Flag
        v-else-if="item.flag === 'recheck'"
        class="size-5 text-blue-500"
        aria-hidden="true"
      />
      <Sparkles
        v-else-if="item.flag === 'prefilled'"
        class="size-5 text-blue-500"
        aria-hidden="true"
      />
    </div>
  </button>
</template>

<script setup lang="ts">
import { ChevronRight, Flag, Sparkles } from '@lucide/vue';
import type { UiItem } from '../../../types';

defineProps<{
  item: UiItem;
  isSelected?: boolean;
}>();

defineEmits<{
  click: [item: UiItem];
}>();
</script>

<template>
  <button
    class="grid w-full grid-cols-[1fr_auto] gap-x-4 border-b border-gray-200 px-2 py-3"
    :class="{
      'bg-blue-500': isSelected,
    }"
    @click="$emit('click', item)"
  >
    <p
      class="line-clamp-1 text-left font-['Inter'] text-base font-medium leading-8 text-black"
      :class="{
        'text-white': isSelected,
      }"
    >
      {{ item.source }}
    </p>
    <div class="flex items-center justify-center h-full">
      <Icon v-if="isSelected" class="h-[10px] w-auto text-white" name="chevron-right" />
      <Icon
        v-else-if="item.flag === 'recheck'"
        class="text-blue-500 size-5"
        name="flag"
      />
      <Icon
        v-else-if="item.flag === 'prefilled'"
        class="text-blue-500 size-5"
        name="sparkles"
      />
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

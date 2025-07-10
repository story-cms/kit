<template>
  <span class="rounded-full px-2 py-1 text-xs font-medium" :class="tagStyle">
    {{ tag }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  tag: {
    type: String,
    required: true,
  },
});

const tagStyle = computed(() => {
  switch (props.tag) {
    case 'New':
      return 'bg-green-500/20 text-green-500/100';

    case 'Changed':
    case 'Changes':
      return 'bg-blue-100 text-blue-800/100';

    case 'Issues':
      return 'bg-red-500/20 text-red-500';
    case '':
      return '';
    default:
      return 'bg-yellow-500/20 text-yellow-800/100';
  }
});
</script>

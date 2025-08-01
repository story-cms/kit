<template>
  <button
    type="button"
    class="cursor-pointer rounded-full bg-blue-100 py-2 shadow-md hover:bg-blue-200"
    :class="{ 'px-12': hasShortLabel, 'px-4': !hasShortLabel }"
    @click="emit('tap')"
  >
    <span class="text-blue-800">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
}>();

const emit = defineEmits<{
  (e: 'tap'): void;
}>();

const hasShortLabel = computed(() => {
  return props.label.length < 10;
});
</script>

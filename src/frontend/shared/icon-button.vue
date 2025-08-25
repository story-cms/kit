<template>
  <button
    type="button"
    class="rounded-full bg-blue-100 p-2 shadow-md hover:bg-blue-200"
    @click="emit('tap')"
  >
    <Icon :name="icon" class="text-blue-800" />
  </button>
</template>

<script setup lang="ts">
import Icon from './icon.vue';

defineProps<{
  icon: string;
}>();

const emit = defineEmits<{
  (e: 'tap'): void;
}>();
</script>

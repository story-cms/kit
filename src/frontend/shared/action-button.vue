<template>
  <button
    type="button"
    class="grid size-10 cursor-pointer place-content-center rounded-full transition-all duration-200 ease-in-out hover:bg-gray-100"
    @click.prevent="emit('tap')"
  >
    <Icon :name="icon" class="size-6 cursor-pointer text-gray-500" />
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

<template>
  <button
    type="button"
    class="font-dmsans glass-surface inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-75 disabled:cursor-not-allowed disabled:opacity-50"
    :class="active ? 'bg-white/80 shadow-[0_4px_50px_rgba(16,47,53,0.08)]' : 'hover:bg-white/70'"
    :disabled="disabled"
    @click="emit('click')"
  >
    <span class="font-medium text-[#182E33]">{{ label }}</span>
    <span class="font-semibold text-blue-500">{{ count }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  count: number;
  active?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>

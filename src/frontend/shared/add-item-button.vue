<template>
  <button
    type="button"
    class="inline-flex items-center rounded-xl bg-indigo-50 px-3 py-[9px] text-sm font-medium leading-4 text-indigo-700 shadow-sm"
    @click.prevent="emit('add')"
  >
    <span>
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 1V5M5 5V9M5 5H9M5 5L1 5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="currentColor"
        />
      </svg>
    </span>
    <span class="ml-2">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['add']);
</script>

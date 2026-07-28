<template>
  <div class="flex flex-col rounded-xl bg-white p-6 font-dmsans">
    <div class="flex items-center gap-3">
      <div
        class="bg-studio-yellow flex size-12 shrink-0 items-center justify-center rounded-full"
      >
        <component :is="icon" class="size-5 text-black" aria-hidden="true" />
      </div>
      <h2 class="text-gray-800">{{ title }}</h2>
    </div>

    <p class="mt-4 text-sm leading-5 text-gray-500">{{ description }}</p>

    <div class="mt-6 flex justify-end">
      <button
        type="button"
        class="rounded-full bg-[#F3F4F6] px-4 py-2 text-sm font-semibold leading-5 text-[#182E33] transition-colors hover:bg-gray-200"
        @click="emit('action')"
      >
        Go
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  title: string;
  description: string;
}>();

const emit = defineEmits<{
  (e: 'action'): void;
}>();
</script>

<template>
  <div class="flex flex-col gap-8 rounded-xl bg-white p-6 font-dmsans">
    <div class="flex items-center gap-3">
      <div
        class="flex size-12 shrink-0 items-center justify-center rounded-full bg-studio-yellow"
      >
        <component :is="icon" class="size-5 text-black" aria-hidden="true" />
      </div>
      <h2 class="text-gray-800">{{ title }}</h2>
    </div>

    <p>{{ description }}</p>

    <div class="flex justify-end">
      <StudioButton
        label="Go"
        variant="secondary"
        :disabled="disabled"
        @click="emit('action')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import StudioButton from '../shared/studio-button.vue';

defineProps<{
  icon: Component;
  title: string;
  description: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'action'): void;
}>();
</script>

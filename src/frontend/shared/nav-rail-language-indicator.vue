<template>
  <div
    class="relative flex size-14 items-center justify-center rounded-full"
    aria-hidden="true"
  >
    <span
      class="absolute right-2 top-4 rounded-xl bg-studio-lime px-1 py-[2px] text-[8px] font-medium uppercase leading-[9.36px] text-studio-forest"
    >
      {{ currentLocale }}
    </span>
    <Languages class="size-6" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { Languages } from '@lucide/vue';

defineProps<{
  currentLocale: string;
}>();
</script>

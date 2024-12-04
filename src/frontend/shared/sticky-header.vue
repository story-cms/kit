<template>
  <div
    class="w-full mb-2 bg-gray-50"
    :class="{ 'fixed inset-x-0 top-0 z-10': !shared.isIntersecting }"
  >
    <slot />

    <hr
      :class="{
        'container mx-auto px-3': shared.isIntersecting,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSharedStore } from '../store';

const shared = useSharedStore();

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      shared.setIsIntersecting(entry.isIntersecting);
    }
  },
  {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  },
);

onMounted(() => {
  const navbar = document.getElementById('navbar') as HTMLElement;
  observer.observe(navbar);
});
</script>

<template>
  <div class="mb-2 bg-gray-50">
    <slot />

    <hr />
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

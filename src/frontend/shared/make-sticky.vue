<template>
  <div
    :class="[
      props.style,
      !shared.isIntersecting
        ? 'container fixed inset-x-0 top-5 z-10 mx-auto flex justify-end px-3'
        : '',
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSharedStore } from '../store';

const props = defineProps<{
  elId: string | 'top';
  style?: string;
}>();

const shared = useSharedStore();

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      shared.setIsIntersecting(entry.isIntersecting);
    }
  },
  {
    root: null,
    rootMargin: '10px',
    threshold: 0.8,
  },
);

onMounted(() => {
  const el = document.getElementById(props.elId) as HTMLElement;
  observer.observe(el);
});
</script>

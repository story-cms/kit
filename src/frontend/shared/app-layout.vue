<template>
  <div class="bg-app_gray">
    <div id="top"></div>
    <div
      :class="[
        'container relative mx-auto grid h-full w-full transition-all duration-300 ease-in-out',
        shared.hasNonFloatingSidebar ? 'grid-cols-[360px_1fr] gap-x-10' : 'grid-cols-1',
      ]"
    >
      <Sidebar />
      <div :class="[shared.hasNonFloatingSidebar ? '' : 'pt-16', 'px-3 py-10']">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './sidebar.vue';

import { onMounted, onUnmounted, watch } from 'vue';
import { useSharedStore } from '../store';
const shared = useSharedStore();

const resizeHook = () => {
  const fresh = document.documentElement.clientWidth;
  shared.setLargeScreen(fresh >= 1324);
  if (shared.isLargeScreen && shared.hasNonFloatingSidebar) {
    shared.setSidebarOpen(true);
  }
  if (!shared.isLargeScreen && !shared.hasNonFloatingSidebar) {
    shared.setSidebarOpen(false);
  }
};

watch(
  () => shared.isLargeScreen,
  (newVal) => {
    if (newVal) {
      shared.setSidebarAsFloating(false);
    } else {
      shared.setSidebarAsFloating(true);
    }
  },
  { immediate: true },
);

onMounted(() => {
  window.addEventListener('resize', resizeHook);
  resizeHook();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHook);
});
</script>

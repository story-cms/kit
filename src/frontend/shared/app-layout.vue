<template>
  <div class="bg-app_gray">
    <div id="top"></div>
    <div
      :class="[
        'container relative mx-auto grid h-full w-full transition-all duration-300 ease-in-out',
        shared.sidebarIsOpen ? 'grid-cols-[360px_1fr] gap-x-10' : 'grid-cols-1',
      ]"
    >
      <Sidebar />
      <div :class="[shared.sidebarIsOpen ? '' : 'pt-16', 'px-3 py-10']">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageCentre from './message-centre.vue';
import Sidebar from './sidebar.vue';
import LoremIpsum from './LoremIpsum.vue';

import { onMounted, onUnmounted, ref } from 'vue';
import { useSharedStore } from '../store';
const shared = useSharedStore();

const resizeHook = () => {
  const fresh = document.documentElement.clientWidth;
  shared.setLargeScreen(fresh >= 1116);
};

onMounted(() => {
  window.addEventListener('resize', resizeHook);
  resizeHook();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHook);
});

const sidebarOpen = ref(false);
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

console.log('isIntersecting', shared.isIntersecting);
</script>

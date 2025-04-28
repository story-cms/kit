<template>
  <div class="bg-gray-50">
    <div
      :class="[
        'container relative mx-auto grid min-h-screen px-3 transition-all duration-75',
        shared.isLargeScreen ? 'grid-cols-[320px_auto] gap-x-3' : 'grid-cols-[96px_auto]',
      ]"
    >
      <Sidebar />
      <div class="relative">
        <div class="mx-auto max-w-[860px] pb-6">
          <header
            ref="header"
            :class="[
              'sticky top-0 h-[100px] bg-gray-50 transition-all duration-75',
              shared.isMainUnderHeader ? 'border-x border-b border-gray-200' : '',
            ]"
          >
            <p>Header</p>
            <p>Is large screen: {{ shared.isLargeScreen }}</p>
          </header>
          <main ref="main" class="mt-1"></main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import { useSharedStore } from '../store';

import Sidebar from './sidebar.vue';

const shared = useSharedStore();

const header = ref<HTMLElement | null>(null);
const main = ref<HTMLElement | null>(null);

const onScroll = () => {
  if (header.value && main.value) {
    const headerRect = header.value.getBoundingClientRect();
    const mainRect = main.value.getBoundingClientRect();
    shared.setMainUnderHeader(mainRect.top <= headerRect.bottom);
  }
};
const resizeHook = () => {
  const fresh = document.documentElement.clientWidth;
  shared.setLargeScreen(fresh >= 1280);
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resizeHook);
  resizeHook();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});
onUnmounted(() => {
  window.removeEventListener('resize', resizeHook);
});
</script>

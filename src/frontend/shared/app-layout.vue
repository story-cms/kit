<template>
  <div class="fixed right-0 z-50 grid grid-cols-1 bg-white">
    <p>Has non floating sidebar: {{ shared.hasFloatingSidebar }}</p>
    <p>Is large screen: {{ shared.isLargeScreen }}</p>
    <p>Has open sidebar: {{ shared.hasOpenSidebar }}</p>
  </div>
  <div class="bg-gray-50">
    <div
      :class="[
        'container relative mx-auto grid min-h-screen px-3 transition-all duration-75',

        {
          'grid-cols-[96px_auto]':
            (!shared.isLargeScreen || !shared.hasOpenSidebar) &&
            !shared.hasFloatingSidebar,
        },
        {
          'grid-cols-[320px_auto] gap-x-3': shared.isLargeScreen,
        },
      ]"
    >
      <Sidebar />
      <div class="relative">
        <div class="pb-6 mx-auto">
          <header
            ref="header"
            :class="[
              'sticky top-0 z-10 bg-gray-50 transition-all duration-75',
              shared.isMainUnderHeader ? 'border-x border-b border-gray-200' : '',
            ]"
          >
            <slot name="header" />
          </header>
          <main ref="main" class="h-full mt-1">
            <slot />
          </main>
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
  shared.setSidebarOpen(fresh >= 1280);

  if (!shared.isLargeScreen && shared.hasOpenSidebar) {
    shared.setSidebarAsFloating(true);
  }

  if (shared.isLargeScreen && shared.hasOpenSidebar) {
    shared.setSidebarAsFloating(false);
  }
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

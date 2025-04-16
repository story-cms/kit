<template>
  <div class="bg-app_gray">
    <div id="top"></div>
    <div
      :class="[
        'container relative mx-auto grid h-full w-full transition-all duration-300 ease-in-out',
        shared.openSidebar ? 'grid-cols-[360px_1fr] gap-x-10' : 'grid-cols-1',
      ]"
    >
      <Sidebar />
      <div :class="[shared.openSidebar ? '' : 'pt-16', 'px-3 py-10']">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import Sidebar from './sidebar.vue';

import { onMounted, onUnmounted, watch, computed } from 'vue';
import { useSharedStore } from '../store';
import { UiProgress } from '../../types';
const shared = useSharedStore();

const resizeHook = () => {
  const fresh = document.documentElement.clientWidth;
  shared.setLargeScreen(fresh >= 1324);
  if (shared.isLargeScreen && shared.openSidebar) {
    shared.expandMenu = true;
  }
  if (!shared.isLargeScreen && !shared.openSidebar) {
    shared.expandMenu = false;
  }
};

const getUiProgress = async () => {
  try {
    const response = await axios.get('/ui/progress');

    const { flaggedCount, translatedCount, totalCount } = response.data.find(
      (progress: UiProgress) => progress.locale === shared.language.locale,
    );

    const todoCount = flaggedCount + (totalCount - translatedCount);
    shared.setUiTodos(todoCount);
  } catch (error) {
    console.error(error);
  }
};

watch(
  () => shared.isLargeScreen,
  (newVal) => {
    if (newVal) {
      shared.openSidebar = true;
    } else {
      shared.openSidebar = false;
    }
  },
  { immediate: true },
);

onMounted(() => {
  window.addEventListener('resize', resizeHook);
  resizeHook();
  getUiProgress();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHook);
});
</script>

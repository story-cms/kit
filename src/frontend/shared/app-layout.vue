<template>
  <div ref="layout" class="bg-gray-50 pb-6">
    <div ref="container" class="relative mx-auto min-h-screen px-3">
      <Sidebar />
      <div
        :class="[
          'relative',
          {
            'ml-[84px]': !shared.isLargeScreen || !shared.hasOpenSidebar,
            'ml-[264px]': shared.isLargeScreen && shared.hasOpenSidebar,
          },
        ]"
      >
        <div class="mx-auto max-w-7xl pb-6">
          <header ref="header" class="z-10 bg-gray-50">
            <slot v-if="!shared.hasFeedback" name="header" />
            <MessageCentre
              v-else
              :response="shared.messageCentre.response"
              :message="shared.messageCentre.message"
            />
          </header>
          <main ref="main" class="mt-1 h-full">
            <slot />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onBeforeMount } from 'vue';
import { useSharedStore } from '../store';

import Sidebar from './sidebar.vue';
import MessageCentre from './message-centre.vue';

const shared = useSharedStore();

const header = ref<HTMLElement | null>(null);
const main = ref<HTMLElement | null>(null);
const layout = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);

const setDimensions = () => {
  if (header.value) {
    const headerRect = header.value.getBoundingClientRect();
    shared.setHeaderSize(headerRect.height, headerRect.width);
  }

  if (layout.value) {
    const layoutRect = layout.value.getBoundingClientRect();
    shared.setLayoutWidth(layoutRect.width);
  }

  if (container.value) {
    const containerRect = container.value.getBoundingClientRect();
    shared.setContainerWidth(containerRect.width);
  }
};

const resizeHook = () => {
  const fresh = document.documentElement.clientWidth;
  shared.setLargeScreen(fresh >= 1280);
};

onBeforeMount(() => {
  resizeHook();
  setDimensions();
});

onMounted(() => {
  shared.setShowAppPreview(shared.meta.hasAppPreview);
  window.addEventListener('resize', resizeHook);
  resizeHook();
  setDimensions();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHook);
});
</script>

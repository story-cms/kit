<template>
  <div ref="layout" class="bg-gray-50">
    <div
      ref="container"
      :class="['relative mx-auto min-h-screen px-3 transition-all duration-75']"
    >
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
        <div class="max-w-6xl pb-6 mx-auto">
          <header
            ref="header"
            :class="[
              'sticky top-0 z-10 bg-gray-50 transition-all duration-75',
              shared.isMainUnderHeader
                ? 'border-x border-b border-gray-200'
                : 'border-gray-50',
            ]"
          >
            <slot v-if="!shared.hasFeedback" name="header" />
            <MessageCentre
              v-else
              :response="shared.messageCentre.response"
              :message="shared.messageCentre.message"
            />
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
import { ref, onMounted, onBeforeUnmount, onUnmounted, onBeforeMount } from 'vue';
import { useSharedStore } from '../store';

import Sidebar from './sidebar.vue';
import MessageCentre from './message-centre.vue';

const shared = useSharedStore();

const header = ref<HTMLElement | null>(null);
const main = ref<HTMLElement | null>(null);
const layout = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);

const onScroll = () => {
  if (header.value && main.value) {
    const headerRect = header.value.getBoundingClientRect();
    const mainRect = main.value.getBoundingClientRect();
    shared.setMainUnderHeader(mainRect.top <= headerRect.bottom);
    shared.setHeaderSize(headerRect.height, headerRect.width);
  }
  setDimensions();
};

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
  shared.setSingleColumn(fresh < 1280);

  if (!shared.isLargeScreen && shared.hasOpenSidebar) {
    shared.setSidebarAsFloating(true);
  }

  if (shared.isLargeScreen && shared.hasOpenSidebar) {
    shared.setSidebarAsFloating(false);
  }
  if (!shared.isLargeScreen) {
    shared.setShowAppPreview(false);
    shared.setShowMetaBox(false);
  }
  if (shared.isLargeScreen) {
    shared.setShowAppPreview(true);
    shared.setShowMetaBox(true);
    shared.setContentSidebarAsFloating(false);
    shared.setSingleColumn(false);
  }

  setDimensions();
};

onBeforeMount(() => {
  resizeHook();
});

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resizeHook);
  resizeHook();
  setDimensions();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});
onUnmounted(() => {
  window.removeEventListener('resize', resizeHook);
});
</script>

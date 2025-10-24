<template>
  <div ref="layout" class="bg-gray-50 pb-6">
    <div
      ref="container"
      :class="['relative mx-auto min-h-screen px-3 transition-all duration-75']"
    >
      <component :is="shared.sidebar" />
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
          <main ref="main" class="mt-1 h-full">
            <div ref="sentinel" class="h-px w-full"></div>
            <slot />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onBeforeMount, watch } from 'vue';
import { useSharedStore } from '../store';
import MessageCentre from './message-centre.vue';

const shared = useSharedStore();

const header = ref<HTMLElement | null>(null);
const main = ref<HTMLElement | null>(null);
const layout = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

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

watch(
  () => shared.hasOpenSidebar,
  (newVal: boolean) => {
    localStorage.setItem(
      `${shared.meta.name.replaceAll(' ', '-')}-sidebar-state`,
      newVal.toString(),
    );
  },
);

const resizeHook = () => {
  const fresh = document.documentElement.clientWidth;
  shared.setLargeScreen(fresh >= 1280);
  setDimensions();
};

onBeforeMount(() => {
  resizeHook();
});

onMounted(() => {
  shared.setShowAppPreview(shared.meta.hasAppPreview);
  window.addEventListener('resize', resizeHook);
  resizeHook();
  setDimensions();

  if (sentinel.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        shared.setMainUnderHeader(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      },
    );
    observer.observe(sentinel.value);
  }

  const sidebarState = localStorage.getItem(
    `${shared.meta.name.replaceAll(' ', '-')}-sidebar-state`,
  );
  if (sidebarState !== null) {
    shared.setSidebarOpen(sidebarState === 'true' ? true : false);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHook);
  if (observer && sentinel.value) {
    observer.unobserve(sentinel.value);
    observer.disconnect();
  }
});
</script>

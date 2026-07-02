<template>
  <div ref="layout" class="bg-gray-50 pb-6">
    <div
      ref="container"
      :class="['relative mx-auto min-h-screen px-3 transition-all duration-75']"
    >
      <component :is="shared.sidebar" v-if="!isInitializing" />
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
          <AppLayoutHeader ref="headerComponent">
            <template #header>
              <slot name="header" />
            </template>
          </AppLayoutHeader>
          <main ref="main" class="mt-1 h-full">
            <slot />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onBeforeMount, watch, nextTick } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { useSharedStore } from '../store';
import AppLayoutHeader from './app-layout-header.vue';
import type { SharedPageProps } from '../../types';

const shared = useSharedStore();
const page = usePage();

watch(
  () => {
    const props = page.props;
    if (!props?.config) return null;

    return {
      config: props.config,
      user: props.user,
      language: props.language,
      errors: props.errors,
      bookmarks: props.bookmarks,
    };
  },
  (next) => {
    if (next) shared.setFromProps(next as SharedPageProps);
  },
  { deep: true },
);

const headerComponent = ref<InstanceType<typeof AppLayoutHeader> | null>(null);
const layout = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);

const isInitializing = ref(true);

const setDimensions = () => {
  const headerEl = headerComponent.value?.header ?? null;
  if (headerEl) {
    const headerRect = headerEl.getBoundingClientRect();
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
    localStorage.setItem('sidebar-state', newVal.toString());
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
  shared.setShowAppPreview(shared.config.hasAppPreview);
  window.addEventListener('resize', resizeHook);
  resizeHook();
  setDimensions();

  const sidebarState = localStorage.getItem('sidebar-state');

  if (sidebarState !== null) {
    shared.setSidebarOpen(sidebarState === 'true' ? true : false);
  }

  // Allow sidebar to render after state is set to prevent layout shift
  nextTick(() => {
    isInitializing.value = false;
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHook);
});
</script>

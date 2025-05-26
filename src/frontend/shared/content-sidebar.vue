<template>
  <div
    v-if="shared.showMetaBox || shared.showAppPreview"
    :class="[
      'w-[375px]',
      shared.hasFloatingContentSidebar ? 'fixed' : 'sticky [align-self:start]',
    ]"
    :style="{
      top: `${headerHeight + 4}px`,
      right: shared.hasFloatingContentSidebar ? rightPosition : '',
    }"
  >
    <section v-if="shared.showMetaBox">
      <slot name="meta-box" />
    </section>
    <section v-if="shared.showAppPreview">
      <slot name="app-preview" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useSharedStore } from '../store';

const shared = useSharedStore();
const { showMetaBox, showAppPreview, isSingleColumn, showSourceColumn } =
  storeToRefs(shared);
const { isLargeScreen } = storeToRefs(shared);

const headerHeight = computed(() => shared.headerHeight);

const rightPosition = computed(() => {
  const difference = shared.layoutWidth - shared.containerWidth;
  return `${difference / 2 + 12}px`;
});

watch([showMetaBox, showAppPreview, isLargeScreen, showSourceColumn], ([a, b, c, d]) => {
  if (!a && !b) {
    shared.setContentSidebarAsFloating(false);
    shared.setSingleColumn(true);
  }

  if (shared.isTranslationIndex) {
    if (c && (a || b)) {
      shared.setContentSidebarAsFloating(false);
      shared.setSingleColumn(false);
    }
    if (d && (a || b)) {
      shared.setContentSidebarAsFloating(true);
      shared.setSingleColumn(true);
    }
    if (!c && !d) {
      shared.setContentSidebarAsFloating(true);
      shared.setSingleColumn(true);
    }
  }
  if (!shared.isTranslationIndex) {
    if (c && (a || b)) {
      shared.setContentSidebarAsFloating(false);
      shared.setSingleColumn(false);
    }
    if (!c && (a || b)) {
      shared.setContentSidebarAsFloating(true);
      shared.setSingleColumn(true);
    }
  }
});

watch(
  () => isSingleColumn.value,
  (value) => {
    shared.setContentSidebarAsFloating(value);
  },
);

onMounted(() => {
  if (isSingleColumn.value) {
    shared.setContentSidebarAsFloating(true);
  }
});
</script>

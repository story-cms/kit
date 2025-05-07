<template>
  <div
    v-if="drafts.showMetaBox || drafts.showAppPreview"
    :class="[
      'w-[375px]',
      drafts.hasFloatingContentSidebar ? 'fixed' : 'sticky [align-self:start]',
    ]"
    :style="{
      top: `${headerHeight + 4}px`,
      right: drafts.hasFloatingContentSidebar ? rightPosition : '',
    }"
  >
    <section v-if="drafts.showMetaBox">
      <slot name="meta-box" />
    </section>
    <section v-if="drafts.showAppPreview">
      <slot name="app-preview" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useDraftsStore, useSharedStore } from '../store';

const drafts = useDraftsStore();
const shared = useSharedStore();
const { showMetaBox, showAppPreview, isSingleColumn, showSourceColumn } =
  storeToRefs(drafts);
const { isLargeScreen } = storeToRefs(shared);

const headerHeight = computed(() => shared.headerHeight);

const rightPosition = computed(() => {
  const difference = shared.layoutWidth - shared.containerWidth;
  return `${difference / 2 + 12}px`;
});

watch([showMetaBox, showAppPreview, isLargeScreen, showSourceColumn], ([a, b, c, d]) => {
  if (!a && !b) {
    drafts.setContentSidebarAsFloating(false);
    drafts.setSingleColumn(true);
  }
  if (c && (a || b)) {
    drafts.setContentSidebarAsFloating(false);
    drafts.setSingleColumn(false);
  }
  if (d && (a || b)) {
    drafts.setContentSidebarAsFloating(true);
    drafts.setSingleColumn(true);
  }
});

watch(
  () => isSingleColumn.value,
  (value) => {
    drafts.setContentSidebarAsFloating(value);
  },
);

onMounted(() => {
  if (isSingleColumn.value) {
    drafts.setContentSidebarAsFloating(true);
  }
});
</script>

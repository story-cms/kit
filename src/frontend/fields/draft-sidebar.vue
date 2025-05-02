<template>
  <div
    v-if="drafts.showMetaBox || drafts.showAppPreview"
    :class="[
      'w-[375px]',
      drafts.hasFloatingDraftSidebar ? 'fixed' : 'sticky [align-self:start]',
    ]"
    :style="{
      top: `${headerHeight + 4}px`,
      right: drafts.hasFloatingDraftSidebar ? rightPosition : '',
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
import { useDraftsStore, useSharedStore } from '../store';

const drafts = useDraftsStore();
const shared = useSharedStore();

const isLargeScreen = computed(() => shared.isLargeScreen);
const headerHeight = computed(() => shared.headerHeight);

const rightPosition = computed(() => {
  const difference = shared.layoutWidth - shared.containerWidth;
  return `${difference / 2 + 12}px`;
});

watch([drafts.showMetaBox, drafts.showAppPreview, isLargeScreen], ([a, b, c]) => {
  if (!a && !b) {
    drafts.setDraftSidebarAsFloating(false);
    drafts.setSingleColumn(true);
  }
  if (c && (a || b)) {
    drafts.setDraftSidebarAsFloating(false);
    drafts.setSingleColumn(false);
  }
});

watch(
  () => drafts.isSingleColumn,
  (value) => {
    drafts.setDraftSidebarAsFloating(value);
  },
);

onMounted(() => {
  if (drafts.isSingleColumn) {
    drafts.setDraftSidebarAsFloating(true);
  }
});
</script>

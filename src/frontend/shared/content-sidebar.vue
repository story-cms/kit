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
import { storeToRefs } from 'pinia';
import { useDraftsStore, useSharedStore } from '../store';

const drafts = useDraftsStore();
const shared = useSharedStore();
const { showMetaBox, showAppPreview, isSingleColumn } = storeToRefs(drafts);
const { isLargeScreen } = storeToRefs(shared);

const headerHeight = computed(() => shared.headerHeight);

const rightPosition = computed(() => {
  const difference = shared.layoutWidth - shared.containerWidth;
  return `${difference / 2 + 12}px`;
});

watch([showMetaBox, showAppPreview, isLargeScreen], ([a, b, c]) => {
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
  () => isSingleColumn.value,
  (value) => {
    drafts.setDraftSidebarAsFloating(value);
  },
);

onMounted(() => {
  if (isSingleColumn.value) {
    drafts.setDraftSidebarAsFloating(true);
  }
});
</script>

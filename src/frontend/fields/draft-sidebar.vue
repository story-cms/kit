<template>
  <div
    v-if="showMetaBox || showAppPreview"
    :class="{
      'fixed right-0': drafts.hasFloatingDraftSidebar,
      'sticky [align-self:start]': !drafts.hasFloatingDraftSidebar,
    }"
    :style="{
      top: `${headerHeight + 24}px`,
    }"
  >
    <section v-if="showMetaBox">
      <slot name="meta-box" />
    </section>
    <section v-if="showAppPreview">
      <slot name="app-preview" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, computed, toRefs } from 'vue';
import { useDraftsStore, useSharedStore } from '../store';

const drafts = useDraftsStore();
const shared = useSharedStore();
const props = defineProps<{
  showMetaBox: boolean;
  showAppPreview?: boolean;
}>();

const { showMetaBox, showAppPreview } = toRefs(props);

const isLargeScreen = computed(() => shared.isLargeScreen);
const headerHeight = computed(() => shared.headerHeight);
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

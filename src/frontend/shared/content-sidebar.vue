<template>
  <div
    v-if="shared.showMetaBox || shared.showAppPreview"
    :class="['w-[375px]', isFloating ? 'fixed' : 'sticky [align-self:start]']"
    :style="{
      top: `${sidebarTopOffset}px`,
      right: isFloating ? rightPosition : '',
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
import { watch, onMounted, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSharedStore } from '../store';

const props = defineProps<{
  isComplexLayout?: boolean;
}>();

const isFloating = ref(false);
const sidebarWidth = 375;
const sidebarGap = 16;
const minimumContentWidth = 720;
const headerTopOffset = 12;
const headerGap = 16;

const shared = useSharedStore();
const { showMetaBox, showAppPreview, isSingleColumn, showSourceColumn } =
  storeToRefs(shared);
const { isLargeScreen } = storeToRefs(shared);

const headerHeight = computed(() => shared.headerHeight);
const sidebarTopOffset = computed(() => headerHeight.value + headerTopOffset + headerGap);

const rightPosition = computed(() => {
  const difference = shared.layoutWidth - shared.containerWidth;
  return `${difference / 2 + 12}px`;
});

const contentWidthWithSidebar = computed(() => {
  const availableWidth = shared.headerWidth || shared.containerWidth;
  return availableWidth - sidebarWidth - sidebarGap;
});

const isSingleAndFloating = () => {
  const isShowingElements = showMetaBox.value || showAppPreview.value;
  // Small screen
  if (!isLargeScreen.value) {
    return true;
  }
  // Large screen
  if (!isShowingElements) return true;
  if (contentWidthWithSidebar.value < minimumContentWidth) return true;

  if (props.isComplexLayout) {
    if (isShowingElements && !showSourceColumn.value) return false;
    return true;
  }

  return false;
};

watch(
  [showMetaBox, showAppPreview, isLargeScreen, showSourceColumn, contentWidthWithSidebar],
  () => {
    if (!showMetaBox.value && !showAppPreview.value) {
      isFloating.value = false;
      shared.setSingleColumn(true);
    }

    const setting = isSingleAndFloating();
    shared.setSingleColumn(setting);
    isFloating.value = setting;
  },
);

watch(
  () => isSingleColumn.value,
  (value) => {
    isFloating.value = value;
  },
);

onMounted(() => {
  if (isSingleColumn.value) {
    isFloating.value = true;
  }
});
</script>

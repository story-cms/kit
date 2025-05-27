<template>
  <div
    v-if="shared.showMetaBox || shared.showAppPreview"
    :class="['w-[375px]', isFloating ? 'fixed' : 'sticky [align-self:start]']"
    :style="{
      top: `${headerHeight + 4}px`,
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

const setIsFloating = (value: boolean) => {
  isFloating.value = value;
};

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
    setIsFloating(false);
    shared.setSingleColumn(true);
  }

  if (props.isComplexLayout) {
    if (c && (a || b)) {
      setIsFloating(false);
      shared.setSingleColumn(false);
    }
    if (d && (a || b)) {
      setIsFloating(true);
      shared.setSingleColumn(true);
    }
    if (!c && !d) {
      setIsFloating(true);
      shared.setSingleColumn(true);
    }
  }
  if (!props.isComplexLayout) {
    if (c && (a || b)) {
      setIsFloating(false);
      shared.setSingleColumn(false);
    }
    if (!c && (a || b)) {
      setIsFloating(true);
      shared.setSingleColumn(true);
    }
  }
});

watch(
  () => isSingleColumn.value,
  (value) => {
    setIsFloating(value);
  },
);

onMounted(() => {
  if (isSingleColumn.value) {
    setIsFloating(true);
  }
});
</script>

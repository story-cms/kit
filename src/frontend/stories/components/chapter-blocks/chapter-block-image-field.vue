<template>
  <ImageField :field="fieldSpec" :root-path="rootPath" :is-nested="true" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';

import type { FieldSpec } from '../../../../types';
import ImageField from '../../../fields/image-field.vue';
import { useModelStore } from '../../../store';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    blockId: string;
    label?: string;
  }>(),
  {
    label: 'Cover Image',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const model = useModelStore();
const rootPath = computed(() => `_chapterBlocks.${props.blockId}`);
const coverImagePath = computed(() => `${rootPath.value}.coverImage`);

const fieldSpec = computed(
  (): FieldSpec => ({
    label: props.label,
    name: 'coverImage',
    widget: 'image',
    description: 'PNG, JPG • Recommended 1280x720px',
    extensions: ['.jpeg', '.jpg', '.png'],
    maxSize: 5662310,
  }),
);

const readCoverImage = (): string => model.getField(coverImagePath.value, '') as string;

watch(
  () => props.modelValue,
  (value) => {
    const current = readCoverImage();
    if (current === value) return;
    model.setField(coverImagePath.value, value);
  },
  { immediate: true },
);

const unsubscribe = model.$subscribe(() => {
  const fresh = readCoverImage();
  if (fresh === props.modelValue) return;
  emit('update:modelValue', fresh);
});

onBeforeUnmount(() => {
  unsubscribe();
});
</script>

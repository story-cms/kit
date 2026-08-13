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
    itemId?: string;
    label?: string;
  }>(),
  {
    itemId: undefined,
    label: 'Cover Image',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const model = useModelStore();
const rootPath = computed(() => `_chapterBlocks.${props.blockId}`);
const fieldName = computed(() =>
  props.itemId ? `items.${props.itemId}.imageUrl` : 'coverImage',
);
const fieldPath = computed(() => `${rootPath.value}.${fieldName.value}`);

const fieldSpec = computed(
  (): FieldSpec => ({
    label: props.label,
    name: fieldName.value,
    widget: 'image',
    description: 'PNG, JPG • Recommended 1280x720px',
    extensions: ['.jpeg', '.jpg', '.png'],
    maxSize: 5662310,
  }),
);

const readValue = (): string => model.getField(fieldPath.value, '') as string;

watch(
  () => props.modelValue,
  (value) => {
    const current = readValue();
    if (current === value) return;
    model.setField(fieldPath.value, value);
  },
  { immediate: true },
);

const unsubscribe = model.$subscribe(() => {
  const fresh = readValue();
  if (fresh === props.modelValue) return;
  emit('update:modelValue', fresh);
});

onBeforeUnmount(() => {
  unsubscribe();
});
</script>

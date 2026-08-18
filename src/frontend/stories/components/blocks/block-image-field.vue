<template>
  <ImageField
    :field="fieldSpec"
    :root-path="rootPath"
    :is-nested="true"
    :is-read-only="readOnly"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';

import type { FieldSpec } from '../../../../types';
import { buildMediaFieldSpec } from '../../../../shared/media_helpers';
import ImageField from '../../../fields/image-field.vue';
import { useModelStore } from '../../../store';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    collectionId: string;
    blockIndex: number;
    itemIndex?: number;
    label?: string;
    readOnly?: boolean;
  }>(),
  {
    itemIndex: undefined,
    label: 'Cover Image',
    readOnly: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const model = useModelStore();
const rootPath = computed(() => `blocks.${props.blockIndex}`);
const fieldName = computed(() =>
  props.itemIndex === undefined
    ? 'coverImage'
    : `items.${props.itemIndex}.imageUrl`,
);
const fieldPath = computed(() => `${rootPath.value}.${fieldName.value}`);

const fieldSpec = computed((): FieldSpec =>
  buildMediaFieldSpec('image', props.collectionId, {
    label: props.label,
    name: fieldName.value,
  }),
);

const getValue = (): string => model.getField(fieldPath.value, '') as string;

watch(
  () => props.modelValue,
  (value) => {
    if (props.readOnly) return;
    const current = getValue();
    if (current === value) return;
    model.setField(fieldPath.value, value);
  },
  { immediate: true },
);

const unsubscribe = model.$subscribe(() => {
  if (props.readOnly) return;
  const fresh = getValue();
  if (fresh === props.modelValue) return;
  emit('update:modelValue', fresh);
});

onBeforeUnmount(() => {
  unsubscribe();
});
</script>

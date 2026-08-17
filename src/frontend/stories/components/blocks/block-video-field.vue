<template>
  <VideoField
    :field="fieldSpec"
    :root-path="rootPath"
    :is-nested="true"
    :is-read-only="readOnly"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';

import type { FieldSpec } from '../../../../types';
import VideoField from '../../../fields/video-field.vue';
import { useModelStore } from '../../../store';

const props = withDefaults(
  defineProps<{
    modelValue: { url: string | null };
    collectionId: string;
    blockIndex: number;
    itemIndex?: number;
    label?: string;
    readOnly?: boolean;
  }>(),
  {
    itemIndex: undefined,
    label: 'Video',
    readOnly: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: { url: string | null }];
}>();

const model = useModelStore();
const rootPath = computed(() => `blocks.${props.blockIndex}`);
const fieldName = computed(() =>
  props.itemIndex === undefined ? 'video' : `items.${props.itemIndex}.video`,
);
const fieldPath = computed(() => `${rootPath.value}.${fieldName.value}`);

const fieldSpec = computed((): FieldSpec => ({
  label: props.label,
  name: fieldName.value,
  widget: 'video',
  description: 'MP4 and MOV files up to 500MB',
  extensions: ['.mp4', '.mov'],
  collectionId: props.collectionId,
  maxSize: 500662310,
}));

const getVideo = (): { url: string | null } =>
  model.getField(fieldPath.value, { url: null }) as { url: string | null };

watch(
  () => props.modelValue,
  (value) => {
    if (props.readOnly) return;
    const current = getVideo();
    if (current.url === value.url) return;
    model.setField(fieldPath.value, value);
  },
  { immediate: true, deep: true },
);

const unsubscribe = model.$subscribe(() => {
  if (props.readOnly) return;
  const fresh = getVideo();
  if (fresh.url === props.modelValue.url) return;
  emit('update:modelValue', { ...fresh });
});

onBeforeUnmount(() => {
  unsubscribe();
});
</script>

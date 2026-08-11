<template>
  <VideoField :field="fieldSpec" :root-path="rootPath" :is-nested="true" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';

import type { FieldSpec } from '../../../types';
import VideoField from '../../fields/video-field.vue';
import { useModelStore } from '../../store';

const props = withDefaults(
  defineProps<{
    modelValue: { url: string | null };
    collectionId: string;
    blockId: string;
    label?: string;
  }>(),
  {
    label: 'Video',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: { url: string | null }];
}>();

const model = useModelStore();
const rootPath = computed(() => `_contentBlocks.${props.blockId}`);
const videoPath = computed(() => `${rootPath.value}.video`);

const fieldSpec = computed(
  (): FieldSpec => ({
    label: props.label,
    name: 'video',
    widget: 'video',
    description: 'MP4 and MOV files up to 500MB',
    extensions: ['.mp4', '.mov'],
    collectionId: props.collectionId,
    maxSize: 500662310,
  }),
);

const readVideo = (): { url: string | null } =>
  model.getField(videoPath.value, { url: null }) as { url: string | null };

watch(
  () => props.modelValue,
  (value) => {
    const current = readVideo();
    if (current.url === value.url) return;
    model.setField(videoPath.value, value);
  },
  { immediate: true, deep: true },
);

const unsubscribe = model.$subscribe(() => {
  const fresh = readVideo();
  if (fresh.url === props.modelValue.url) return;
  emit('update:modelValue', { ...fresh });
});

onBeforeUnmount(() => {
  unsubscribe();
});
</script>

<template>
  <AttachmentField
    v-bind="props"
    :url="url"
    :host-service="host"
    :errors="errors"
    @delete="onDelete"
    @attached="onAttached"
  >
    <AudioPlayer :url="url" @duration="onAudioDuration" />
  </AttachmentField>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue';
import type { FieldSpec, Audio } from '../../types';
import { useModelStore, useSharedStore } from '../store';
import { commonProps } from '../shared/helpers';
import AttachmentField from './attachments/attachment-field.vue';
import S3Service from './attachments/s3-service';
import type { AttachmentModel } from './attachments/types';
import AudioPlayer from './attachments/audio-player.vue';

const props = defineProps({
  ...commonProps,
  // The path to the file in the S3 bucket without an extension.
  // If not provided, a unique filename will be generated.
  filePath: {
    type: String,
    required: false,
    default: '',
  },
});

const field = computed(() => props.field as FieldSpec);
const fieldPath = computed(() => {
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

const model = useModelStore();
const shared = useSharedStore();

const emptyAudio = {
  url: null,
  length: null,
};

const startValue = props.isReadOnly
  ? model.getSourceField(fieldPath.value, emptyAudio)
  : (model.getField(fieldPath.value, emptyAudio) as Audio);

const url = ref(startValue.url);
const length = ref(startValue.length);
const host = new S3Service(props.filePath, field.value.folder);
let durationReady = false;

model.$subscribe(() => {
  if (props.isReadOnly) return;

  nextTick().then(() => {
    const fresh = model.getField(fieldPath.value) as Audio;
    url.value = fresh.url;
    length.value = fresh.length;
  });
});

const errors = computed(() => shared.errorMessages(fieldPath.value));

const onDelete = () => {
  model.setField(fieldPath.value, emptyAudio);
  nextTick().then(() => {
    const fresh = model.getField(fieldPath.value) as Audio;
    url.value = fresh.url;
    length.value = fresh.length;
  });
};

const onAttached = async (data: AttachmentModel) => {
  model.setField(fieldPath.value, {
    url: data.url,
    length: length.value,
  });
};

const onAudioDuration = (duration: number) => {
  length.value = duration;
  durationReady = true;
};

watch(
  () => length.value,
  (newLength, oldLength) => {
    if (newLength !== null && newLength !== oldLength && durationReady) {
      model.setField(fieldPath.value, {
        url: url.value,
        length: newLength,
      });
    }
  },
  { immediate: true },
);
</script>

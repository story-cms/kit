<template>
  <div class="flex flex-col gap-4">
    <div v-if="isUploading">
      <VideoProgress
        v-bind="props"
        :bytes-uploaded="bytesUploaded"
        :bytes-total="bytesTotal"
      />
    </div>
    <AttachmentField
      v-else
      v-bind="props"
      :url="url"
      :errors="errors"
      :host-service="host"
      @delete="onDelete"
      @attached="onAttached"
      @dropped="onDropped"
    >
      <VideoPlayer :url="url" :library="host.library" />
    </AttachmentField>

    <div v-if="feedback" class="text-sm text-red-300">
      {{ feedback }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import type { FieldSpec, Video } from '../../types';
import { useModelStore, useSharedStore } from '../store';
import { commonProps } from '../shared/helpers';
import AttachmentField from './attachments/attachment-field.vue';
import BunnyService from './attachments/bunny-service';
import type { AttachmentModel } from './attachments/types';
import VideoPlayer from './attachments/video-player.vue';
import VideoProgress from './attachments/video-progress.vue';

const props = defineProps({
  ...commonProps,
});

const field = computed(() => props.field as FieldSpec);
const fieldPath = computed(() => {
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

const model = useModelStore();
const shared = useSharedStore();

const feedback = ref<string | null>(null);
const bytesUploaded = ref(0);
const bytesTotal = ref(0);
const isUploading = computed(() => bytesUploaded.value > 0);

const emptyVideo = {
  url: null,
};

const startValue = props.isReadOnly
  ? (model.getSourceField(fieldPath.value, emptyVideo) as Video)
  : (model.getField(fieldPath.value, emptyVideo) as Video);

const url = ref(startValue.url);

const onSuccess = (url: string) => {
  console.log('success!', url);

  model.setField(fieldPath.value, {
    url,
  });
};

const onError = (error: Error) => {
  console.log('error', error);
  feedback.value = error.message ?? 'Something went wrong';
};

const onProgress = (uploaded: number, total: number) => {
  bytesUploaded.value = uploaded;
  bytesTotal.value = total;
};

const resetWidget = () => {
  feedback.value = null;
  bytesTotal.value = 0;
  bytesUploaded.value = 0;
};

const host = new BunnyService(onError, onSuccess, onProgress, field.value.collectionId);

model.$subscribe(() => {
  if (props.isReadOnly) return;

  nextTick().then(() => {
    const fresh = model.getField(fieldPath.value) as Video;
    url.value = fresh.url;
  });
});

const errors = computed(() => shared.errorMessages(fieldPath.value));

const onDelete = () => {
  model.setField(fieldPath.value, emptyVideo);
  nextTick().then(() => {
    const fresh = model.getField(fieldPath.value) as Video;
    url.value = fresh.url;
  });
};

const onDropped = (_fileName: string) => {
  resetWidget();
};

const onAttached = (_data: AttachmentModel) => {
  // for video, the file is not uploaded yet,
  // so we need to wait for the onSuccess callback
};
</script>

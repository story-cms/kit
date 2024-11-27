<template>
  <div class="bg-white" :class="{ 'p-8': !isNested, 'mt-4': isNested }">
    <div class="relative">
      <div class="relative">
        <label
          class="input-label"
          :class="{ 'text-error': hasError, 'text-gray-600': isReadOnly }"
          >{{ field.label }}</label
        >
        <button
          v-if="!!url && !props.isReadOnly"
          class="absolute top-2 ltr:right-0 rtl:left-0"
          type="button"
          @click.prevent="emit('delete')"
        >
          <Icon name="trash" class="w-10 h-10 text-gray-500" />
        </button>
      </div>

      <div v-if="!!url" class="flex items-start pt-2">
        <slot></slot>
      </div>

      <div v-else>
        <div
          v-if="!props.isReadOnly"
          class="relative mt-[2px] rounded-md border-2 border-dashed border-gray-300"
        >
          <FileUpload
            :description="defaults.description"
            :extensions="defaults.extensions"
            :max-size="defaults.maxSize"
            @file="onFile"
          />
          <div
            v-if="uploading"
            class="absolute top-0 left-0 w-full h-full bg-gray-400 rounded-md bg-opacity-30"
          >
            <div class="h-full bg-accent opacity-30" :style="progress"></div>
          </div>
        </div>
      </div>
    </div>
    <p v-if="hasError" class="mt-2 text-sm text-error">{{ errors[0] }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { PropType } from 'vue';
import type { FieldSpec } from '../../../types';
import type { HostService } from './types';
import { commonProps } from '../../shared/helpers';
import FileUpload from './file-upload.vue';
import Icon from '../../shared/icon.vue';

const props = defineProps({
  ...commonProps,

  url: {
    type: null as unknown as PropType<string | null>,
    required: true,
  },

  errors: {
    type: Array as PropType<string[]>,
    required: true,
  },

  hostService: {
    type: Object as PropType<HostService>,
    required: true,
  },
});

const emit = defineEmits(['delete', 'attached']);

const field = computed(() => props.field as FieldSpec);
const progress = ref('width:0.9%');
const uploading = ref(false);

const onFileProgress = (percentage: number | undefined) => {
  if (percentage !== undefined) {
    progress.value = `width: ${Math.round(percentage * 100)}%`;
  }
};

const onFile = async (file: File) => {
  uploading.value = true;
  const result = await props.hostService.upload(file, onFileProgress);
  emit('attached', result);
  uploading.value = false;
};

const hasError = computed(() => props.errors.length > 0 && !props.isReadOnly);

const defaults = computed(() => {
  switch (props.field?.widget) {
    case 'animation':
      return {
        description: props.field?.description ?? 'Rive (.riv) files up to 5MB',
        extensions: props.field?.extensions ?? ['.riv'],
        maxSize: props.field?.maxSize ?? 5662310,
      };

    case 'audio':
      return {
        description:
          props.field?.description ?? 'WAV, MP3, OGG, AAC, WMA files up to 35MB',
        extensions: props.field?.extensions ?? ['.wav', '.mp3', '.ogg', '.aac', '.wma'],
        maxSize: props.field?.maxSize ?? 35662310,
      };

    default:
      return {
        description: props.field?.description,
        extensions: props.field?.extensions,
        maxSize: props.field?.maxSize,
      };
  }
});
</script>

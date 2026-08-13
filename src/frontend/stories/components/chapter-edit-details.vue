<template>
  <div
    class="flex flex-col gap-y-2 rounded-xl border border-gray-200 bg-white px-6 pb-11"
  >
    <StringField :field="numberField" :is-nested="true" />
    <StringField :field="titleField" :is-nested="true" />
    <MarkdownField :field="descriptionField" :is-nested="true" />
    <ImageField :field="coverImageField" :is-nested="true" />
    <div class="mt-4">
      <AudioField :field="devotionAudioField" :is-nested="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { FieldSpec } from '../../../types';
import AudioField from '../../fields/audio-field.vue';
import ImageField from '../../fields/image-field.vue';
import MarkdownField from '../../fields/markdown-field.vue';
import StringField from '../../fields/string-field.vue';

const props = defineProps<{
  chapterType?: string | null;
}>();

const chapterLabel = computed(() => props.chapterType?.trim() || 'Chapter');

const numberField = computed((): FieldSpec => ({
  name: 'number',
  label: `${chapterLabel.value} Number`,
  widget: 'string',
  placeholderText: 'e.g., 01',
}));

const titleField = computed((): FieldSpec => ({
  name: 'title',
  label: `${chapterLabel.value} Title`,
  widget: 'string',
  placeholderText: 'e.g., Is there more to life than this?',
}));

const descriptionField: FieldSpec = {
  name: 'description',
  label: 'Description',
  widget: 'markdown',
  noMarkup: true,
  minimal: true,
  toolbar: [],
  placeholderText: 'Brief overview of this session...',
};

const coverImageField: FieldSpec = {
  label: 'Cover Image',
  name: 'coverImage',
  widget: 'image',
  description: 'PNG, JPG • Recommended 1280x720px',
  extensions: ['.jpeg', '.jpg', '.png'],
  maxSize: 5662310,
};

const devotionAudioField: FieldSpec = {
  label: 'Devotion Audio',
  name: 'devotionAudio',
  widget: 'audio',
  description: 'MP3, M4A, WAV up to 200 MB',
  extensions: ['.mp3', '.m4a', '.wav'],
  maxSize: 209715200,
};
</script>

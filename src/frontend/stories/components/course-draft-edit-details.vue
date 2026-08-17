<template>
  <div
    class="flex flex-col gap-y-2 rounded-xl border border-gray-200 bg-white px-6 pb-11"
  >
    <StringField
      v-if="!isTranslation"
      :field="numberField"
      :is-nested="true"
    />
    <div v-else class="mt-4">
      <label :for="numberFieldId" class="input-label text-gray-600">
        {{ numberField.label }}
      </label>
      <input
        :id="numberFieldId"
        type="text"
        class="input-field text-gray-400 shadow-none"
        :value="chapterNumber"
        disabled
      />
    </div>

    <div v-if="isTranslation && showSourceColumn" class="grid grid-cols-2 gap-x-4" dir="ltr">
      <div :dir="translationDir">
        <StringField :field="titleField" :is-nested="true" />
      </div>
      <div dir="ltr">
        <StringField :field="titleField" :is-nested="true" :is-read-only="true" />
      </div>
    </div>
    <div v-else-if="isTranslation" :dir="translationDir">
      <StringField :field="titleField" :is-nested="true" />
    </div>
    <StringField v-else :field="titleField" :is-nested="true" />

    <div v-if="isTranslation && showSourceColumn" class="grid grid-cols-2 gap-x-4" dir="ltr">
      <div :dir="translationDir">
        <MarkdownField :field="descriptionField" :is-nested="true" />
      </div>
      <div dir="ltr">
        <MarkdownField :field="descriptionField" :is-nested="true" :is-read-only="true" />
      </div>
    </div>
    <div v-else-if="isTranslation" :dir="translationDir">
      <MarkdownField :field="descriptionField" :is-nested="true" />
    </div>
    <MarkdownField v-else :field="descriptionField" :is-nested="true" />

    <div v-if="isTranslation && showSourceColumn" class="grid grid-cols-2 gap-x-4" dir="ltr">
      <div :dir="translationDir">
        <ImageField :field="coverImageField" :is-nested="true" />
      </div>
      <div dir="ltr">
        <ImageField :field="coverImageField" :is-nested="true" :is-read-only="true" />
      </div>
    </div>
    <div v-else-if="isTranslation" :dir="translationDir">
      <ImageField :field="coverImageField" :is-nested="true" />
    </div>
    <ImageField v-else :field="coverImageField" :is-nested="true" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import type { FieldSpec } from '../../../types';
import { useModelStore, useSharedStore } from '../../store';
import ImageField from '../../fields/image-field.vue';
import MarkdownField from '../../fields/markdown-field.vue';
import StringField from '../../fields/string-field.vue';

const props = withDefaults(
  defineProps<{
    chapterType?: string | null;
    isTranslation?: boolean;
  }>(),
  {
    isTranslation: false,
  },
);

const model = useModelStore();
const shared = useSharedStore();
const { showSourceColumn } = storeToRefs(shared);

const translationDir = computed(() => (shared.isRtl ? 'rtl' : 'ltr'));

const chapterLabel = computed(() => props.chapterType?.trim() || 'Chapter');

const numberFieldId = computed(() => 'course-draft-number');

const chapterNumber = computed(() => model.getField('number', ''));

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
</script>

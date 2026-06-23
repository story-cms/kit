<template>
  <div class="space-y-8 rounded-xl bg-white py-3">
    <div v-if="isTranslation" class="grid grid-cols-2 gap-x-4 px-8">
      <StringField :field="titleField" :is-nested="true" />
      <StringField :field="titleField" :is-nested="true" :is-read-only="true" />
    </div>
    <StringField v-else :field="titleField" :is-nested="true" class="px-8" />

    <div v-if="isTranslation" class="grid grid-cols-2 gap-x-4 px-8">
      <ImageField :field="coverImageField" :is-nested="true" />
      <ImageField :field="coverImageField" :is-nested="true" :is-read-only="true" />
    </div>
    <ImageField v-else :field="coverImageField" :is-nested="true" class="px-8" />

    <div v-if="isTranslation" class="grid grid-cols-2 gap-x-4 px-8">
      <MarkdownField :field="descriptionField" :is-nested="true" />
      <MarkdownField :field="descriptionField" :is-nested="true" :is-read-only="true" />
    </div>
    <MarkdownField v-else :field="descriptionField" :is-nested="true" class="px-8" />

    <div v-if="isTranslation" class="grid grid-cols-2 gap-x-4 px-8">
      <TagField :field="tagsField" :is-nested="true" />
      <TagField :field="tagsField" :is-nested="true" :is-read-only="true" />
    </div>
    <TagField v-else :field="tagsField" :is-nested="true" class="px-8" />

    <section v-if="!isTranslation" class="space-y-8">
      <StringField
        :field="{
          name: 'chapterLimit',
          label: 'Chapter Count',
          widget: 'string',
          placeholderText: 'e.g., 12',
        }"
        :is-nested="true"
        class="px-8"
      />
      <PanelField
        :field="{
          label: '',
          name: 'contentClassification',
          widget: 'panel',
          backgroundColor: 'gray-50',
          fields: [
            {
              label: 'Story Type',
              name: 'storyType',
              widget: 'string',
              placeholderText: 'e.g., Course, Devotional, Plan',
            },
            {
              label: 'Chapter Type',
              name: 'chapterType',
              widget: 'string',
              placeholderText: 'e.g., Session, Devotion, Day',
            },
            {
              label: 'Section Type',
              name: 'sectionType',
              widget: 'string',
              placeholderText: 'e.g., Part, Section',
            },
          ],
        }"
        :is-nested="true"
        class="px-8 mx-8 rounded-lg"
      />
      <SelectField
        :field="{
          name: 'visibility',
          label: 'Visibility',
          widget: 'select',
          options: [
            { label: 'Public', value: 'public' },
            { label: 'Guests', value: 'guests' },
            { label: 'Leader', value: 'leaders' },
          ],
          default: 'public',
        }"
        :is-nested="true"
        class="px-8"
      />
      <SelectField
        v-if="showTemplateField"
        :field="{
          name: 'template',
          label: 'Content Shape',
          widget: 'select',
          options: templateOptions,
          default: templateOptions[0].value,
        }"
        :is-nested="true"
        class="px-8"
      />
    </section>
    <div class="pb-64" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { BundleTemplate, FieldSpec } from '../../../types';
import MarkdownField from '../../fields/markdown-field.vue';
import StringField from '../../fields/string-field.vue';
import ImageField from '../../fields/image-field.vue';
import TagField from '../../fields/tag-field.vue';
import PanelField from '../../fields/panel-field.vue';
import SelectField from '../../fields/select-field.vue';

const props = withDefaults(
  defineProps<{
    isTranslation?: boolean;
    templates?: BundleTemplate[];
  }>(),
  { isTranslation: false, templates: (): BundleTemplate[] => [] },
);

const showTemplateField = computed(() => props.templates.length > 1);

const templateOptions = computed(() =>
  props.templates.map((template: BundleTemplate) => ({
    label: template.name,
    value: template.id,
  })),
);

const titleField: FieldSpec = {
  name: 'title',
  label: 'Title',
  widget: 'string',
  placeholderText: 'e.g., Introduction to Christianity',
};

const coverImageField: FieldSpec = {
  label: 'Cover Image',
  name: 'coverImage',
  widget: 'image',
  description: 'JPG file up to 300K',
  extensions: ['.jpeg', '.jpg'],
  maxSize: 300000,
};

const descriptionField: FieldSpec = {
  name: 'description',
  label: 'Description/Blurb',
  widget: 'markdown',
  noMarkup: true,
  toolbar: [],
  placeholderText: 'Brief overview of this course...',
};

const tagsField: FieldSpec = {
  name: 'tags',
  label: 'Tags',
  widget: 'tags',
};
</script>

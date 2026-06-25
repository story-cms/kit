<template>
  <div class="space-y-6">
    <div v-if="isTranslation" class="grid grid-cols-2 gap-x-4">
      <StringField :field="titleField" :is-nested="true" />
      <StringField :field="titleField" :is-nested="true" :is-read-only="true" />
    </div>
    <StringField v-else :field="titleField" :is-nested="true" />

    <div v-if="isTranslation" class="grid grid-cols-2 gap-x-4">
      <ImageField :field="coverImageField" :is-nested="true" />
      <ImageField :field="coverImageField" :is-nested="true" :is-read-only="true" />
    </div>
    <ImageField v-else :field="coverImageField" :is-nested="true" />

    <div v-if="isTranslation" class="grid grid-cols-2 gap-x-4">
      <MarkdownField :field="descriptionField" :is-nested="true" />
      <MarkdownField :field="descriptionField" :is-nested="true" :is-read-only="true" />
    </div>
    <MarkdownField v-else :field="descriptionField" :is-nested="true" />

    <div v-if="isTranslation" class="grid grid-cols-2 gap-x-4">
      <TagField :field="tagsField" :is-nested="true" />
      <TagField :field="tagsField" :is-nested="true" :is-read-only="true" />
    </div>
    <TagField v-else :field="tagsField" :is-nested="true" />

    <section v-if="!isTranslation" class="space-y-6">
      <StringField
        :field="{
          name: 'chapterLimit',
          label: 'Chapter Count',
          widget: 'string',
          placeholderText: 'e.g., 12',
        }"
        :is-nested="true"
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
        class="rounded-lg"
      />
      <RichListbox
        v-model="visibility"
        label="Visibility"
        :options="visibilityOptions"
        @update:model-value="setVisibility"
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
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Crown, Globe, User } from '@lucide/vue';
import type { Component } from 'vue';

import type { BundleTemplate, FieldSpec, VisibilityType } from '../../../types';
import { useModelStore } from '../../store';
import MarkdownField from '../../fields/markdown-field.vue';
import StringField from '../../fields/string-field.vue';
import ImageField from '../../fields/image-field.vue';
import TagField from '../../fields/tag-field.vue';
import PanelField from '../../fields/panel-field.vue';
import SelectField from '../../fields/select-field.vue';
import RichListbox from '../../shared/rich-listbox.vue';

const props = withDefaults(
  defineProps<{
    isTranslation?: boolean;
    templates?: BundleTemplate[];
  }>(),
  { isTranslation: false, templates: (): BundleTemplate[] => [] },
);

const model = useModelStore();

const visibility = ref<VisibilityType>(
  model.getField('visibility', 'public') as VisibilityType,
);

const visibilityOptions: {
  value: VisibilityType;
  label: string;
  description: string;
  icon: Component;
}[] = [
  {
    value: 'public',
    label: 'Public',
    description: 'Visible to all users',
    icon: Globe,
  },
  {
    value: 'guests',
    label: 'Guest',
    description: 'Visible to logged-in guests',
    icon: User,
  },
  {
    value: 'leaders',
    label: 'Leader',
    description: 'Restricted to group leaders only',
    icon: Crown,
  },
];

const setVisibility = (value: string) => {
  const visibilityValue = value as VisibilityType;
  visibility.value = visibilityValue;
  model.setField('visibility', visibilityValue);
};

onMounted(() => {
  model.$subscribe(() => {
    visibility.value = model.getField('visibility', 'public') as VisibilityType;
  });
});

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
  minimal: true,
  toolbar: [],
  placeholderText: 'Brief overview of this course...',
};

const tagsField: FieldSpec = {
  name: 'tags',
  label: 'Tags',
  widget: 'tags',
};
</script>

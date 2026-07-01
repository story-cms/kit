<template>
  <div class="form-panel space-y-6">
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

    <StringField
      v-if="!isTranslation"
      :field="{
        name: 'chapterLimit',
        label: 'Chapter Count',
        widget: 'string',
        placeholderText: 'e.g., 12',
      }"
      :is-nested="true"
    />

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
      <PanelField
        :field="contentClassificationField"
        :is-nested="true"
        class="rounded-lg border border-[#E5E7EB]"
      />
      <RichListbox
        v-if="templates.length > 0"
        v-model="template"
        label="Chapter Template"
        :hint="chapterTemplateHint"
        :options="templateRichOptions"
        :is-read-only="isTemplateReadOnly"
        @update:model-value="setTemplate"
      />
      <RichListbox
        v-model="visibility"
        label="Visibility"
        :hint="visibilityHint"
        :options="visibilityOptions"
        @update:model-value="setVisibility"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Crown, FileText, Globe, User } from '@lucide/vue';
import type { Component } from 'vue';

import type { BundleTemplate, FieldSpec, VisibilityType } from '../../../types';
import { useModelStore } from '../../store';
import MarkdownField from '../../fields/markdown-field.vue';
import StringField from '../../fields/string-field.vue';
import ImageField from '../../fields/image-field.vue';
import TagField from '../../fields/tag-field.vue';
import PanelField from '../../fields/panel-field.vue';
import RichListbox from '../../shared/rich-listbox.vue';

const props = withDefaults(
  defineProps<{
    isTranslation?: boolean;
    isEditing?: boolean;
    templates?: BundleTemplate[];
  }>(),
  { isTranslation: false, isEditing: false, templates: (): BundleTemplate[] => [] },
);

const model = useModelStore();

const visibility = ref<VisibilityType>(
  model.getField('visibility', 'public') as VisibilityType,
);

const template = ref<string>(model.getField('template', '') as string);

const chapterTemplateHint =
  'Defines the chapter structure for this story. This cannot be changed after the story is created.';

const visibilityHint =
  'Controls who can see this story in the app. Public stories are visible to all users; guest and leader options restrict access to signed-in users or group leaders.';

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

const setTemplate = (value: string) => {
  template.value = value;
  model.setField('template', value);
};

onMounted(() => {
  model.$subscribe(() => {
    visibility.value = model.getField('visibility', 'public') as VisibilityType;
    template.value = model.getField('template', '') as string;
  });
});

const templateRichOptions = computed(() =>
  props.templates.map((item: BundleTemplate) => ({
    value: item.id,
    label: item.name,
    description: '',
    icon: FileText,
  })),
);

const isTemplateReadOnly = computed(
  () => props.isEditing || props.templates.length <= 1,
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
  label: 'Description',
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

const contentClassificationField: FieldSpec = {
  label: 'Content Classification',
  name: 'contentClassification',
  widget: 'panel',
  labelStyle: 'header',
  hintSections: [
    {
      title: 'Story Type',
      description:
        "The overall theme or category of your course (e.g., 'Educational', 'Devotional', 'Bible Study').",
    },
    {
      title: 'Section Type',
      description:
        "How the course is divided into major sections (e.g., 'Weekly', 'Daily', 'Module').",
    },
    {
      title: 'Chapter Type',
      description:
        "What you call individual lessons or units (e.g., 'Session', 'Lesson', 'Chapter').",
    },
  ],
  hintFooter:
    'These labels help organize and present your content consistently throughout the app.',
  backgroundColor: 'gray-50',
  fields: [
    {
      label: 'Story Type',
      name: 'storyType',
      widget: 'string',
      placeholderText: 'e.g., Course, Devotional, Plan',
    },
    {
      label: 'Section Type',
      name: 'sectionType',
      widget: 'string',
      placeholderText: 'e.g., Part, Module',
    },
    {
      label: 'Chapter Type',
      name: 'chapterType',
      widget: 'string',
      placeholderText: 'e.g., Session, Devotion, Day',
    },
  ],
};
</script>

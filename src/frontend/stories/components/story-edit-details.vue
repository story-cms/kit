<template>
  <div class="space-y-8">
    <StringField
      :field="{
        name: 'name',
        label: 'Title',
        widget: 'string',
      }"
      :is-nested="true"
      class="px-8"
    />
    <ImageField
      :field="{
        label: 'Cover Image',
        name: 'coverImage',
        widget: 'image',
        description: 'JPG file up to 300K',
        extensions: ['.jpeg', '.jpg'],
        maxSize: 300000,
      }"
      :is-nested="true"
      class="px-8"
    />
    <NumberField
      :field="{
        name: 'chapterLimit',
        label: 'Chapters',
        widget: 'number',
      }"
      :is-nested="true"
      class="px-8"
    />
    <TagField
      :field="{
        name: 'tags',
        label: 'Tags',
        widget: 'tags',
      }"
      :is-nested="true"
      class="px-8"
    />
    <MarkdownField
      :field="{
        name: 'description',
        label: 'Description',
        widget: 'markdown',
        toolbar: [],
      }"
      :is-nested="true"
      class="px-8"
    />
    <PanelField
      :field="{
        label: 'Content Classification',
        name: 'contentClassification',
        widget: 'panel',
        fields: [
          {
            label: 'Story Type',
            name: 'storyType',
            widget: 'string',
          },
          {
            label: 'Section Type',
            name: 'sectionType',
            widget: 'string',
          },
          {
            label: 'Chapter Type',
            name: 'chapterType',
            widget: 'string',
          },
        ],
      }"
      :is-nested="true"
      class="px-8"
    />
  </div>
</template>

<script setup lang="ts">
import MarkdownField from '../../fields/markdown-field.vue';
import StringField from '../../fields/string-field.vue';
import ImageField from '../../fields/image-field.vue';
import NumberField from '../../fields/number-field.vue';
import TagField from '../../fields/tag-field.vue';
import PanelField from '../../fields/panel-field.vue';
</script>

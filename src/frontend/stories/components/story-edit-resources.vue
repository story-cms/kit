<template>
  <div class="space-y-8 px-6">
    <ListField
      :field="{
        label: 'Resource',
        name: 'resource',
        widget: 'list',
        canFold: true,
        fields: [
          { label: 'Title', name: 'title', widget: 'string' },
          { label: 'URL/Link', name: 'urlOrLink', widget: 'string' },
          // {
          //   label: 'Video',
          //   name: 'video',
          //   widget: 'video',
          //   description: 'MP4 file up to 3GB',
          //   extensions: ['.mp4'],
          //   maxSize: 3000000000,
          //   collectionId: '3cd72f8e-46ae-4ef6-9f3b-8c445aa609ca',
          // },
          {
            name: 'thumbnail',
            label: 'Thumbnail',
            widget: 'image',
            description: '500px square JPG or PNG up to 10MB',
            extensions: ['.jpeg', '.jpg', '.png'],
            maxSize: 10485760,
            uploadPreset: 'story-meta-thumbnail',
          },
          { label: 'URL', name: 'url', widget: 'string' },
          { label: 'Label', name: 'label', widget: 'string' },
          {
            label: 'Visibility',
            name: 'visibility',
            widget: 'select',
            options: [
              { label: 'Public', value: 'public' },
              { label: 'Private', value: 'private' },
            ],
            default: 'public',
          },
        ],
      }"
      :is-nested="true"
      class="px-8"
    />
  </div>
</template>

<script setup lang="ts">
import ListField from '../../fields/list-field.vue';
</script>

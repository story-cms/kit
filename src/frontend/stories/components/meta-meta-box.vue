<template>
    <MetaBox :primary="primary" :secondary="secondary" />
  </template>
  
  <script setup lang="ts">
  import { formatDate } from '@story-cms/kit/ui';
  import MetaBox from '../../streams/components/meta-box.vue';
  
  const props = defineProps<{
    storyType: string;
    chapterType: string;
    createdAt: string;
    updatedAt: string;
  }>();
  
  const primary = [{ label: 'Story Type', value: props.storyType }];
  const secondary = [
    { label: 'Chapter Type', value: props.chapterType },
    { label: 'Created', value: formatDate(props.createdAt) },
    { label: 'Saved', value: formatDate(props.updatedAt) },
  ];
  </script>
  
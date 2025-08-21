<template>
    <MetaBox :primary="primary" :secondary="secondary" />
  </template>
  <script setup lang="ts">
  import type { PageMeta } from '@story-cms/kit';
  import { formatDate } from '@story-cms/kit/ui';
  import MetaBox from './meta-box.vue';
  
  const props = defineProps<
    Pick<PageMeta, 'createdAt' | 'updatedAt'> & {
      updatedBy: string;
    }
  >();
  
  const primary = [{ label: 'Auto Save', value: formatDate(props.updatedAt) }];
  const secondary = [
    { label: 'Created', value: formatDate(props.createdAt) },
    { label: 'Updated by', value: props.updatedBy },
  ];
  </script>
  
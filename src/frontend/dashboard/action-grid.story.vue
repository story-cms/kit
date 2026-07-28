<template>
  <Story title="Action grid" group="dashboard">
    <Variant title="Default">
      <ActionGrid :items="items" @action="handleAction" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { BookOpen, FileText, Languages } from '@lucide/vue';
import ActionGrid, { ActionGridItem } from './action-grid.vue';

const items: ActionGridItem[] = [
  {
    url: '/en/language/create',
    icon: Languages,
    title: 'New Language',
    description:
      'Engage your audience morning, noon, and night. Create healthy daily rhythms with content that reaches them throughout the day.',
  },
  {
    url: '/en/story/create',
    icon: BookOpen,
    title: 'New Story',
    description:
      'Engage your audience morning, noon, and night. Create healthy daily rhythms with content that reaches them throughout the day.',
  },
  {
    url: '/en/page/create',
    icon: FileText,
    title: 'New Page',
    description:
      'Engage your audience morning, noon, and night. Create healthy daily rhythms with content that reaches them throughout the day.',
    disabled: true,
  },
];

const handleAction = (url: string) => {
  console.log('Action grid action:', url);
};
</script>

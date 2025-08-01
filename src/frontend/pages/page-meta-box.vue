<template>
  <MetaBox :primary="primary" :secondary="[]" />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { PageMeta } from '../../types';
import { formatDate } from '../shared/helpers';
import MetaBox from '../shared/meta-box.vue';
const props = defineProps<
  Pick<PageMeta, 'createdAt' | 'updatedAt'> & {
    savedAt: string;
    publishedAt: string;
  }
>();

const publishedAtLabel = computed(() => {
  if (props.publishedAt === 'unpublished') return 'UNPUBLISHED';
  return formatDate(props.publishedAt);
});

const primary = computed(() => {
  return [
    { label: 'Created', value: formatDate(props.createdAt) },
    { label: 'Auto-Saved', value: formatDate(props.updatedAt) },
    { label: 'Last Published', value: publishedAtLabel.value },
  ];
});
</script>

<template>
  <MetaBox :primary="primary" :secondary="secondary" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDate } from '../shared/helpers';
import MetaBox from '../shared/meta-box.vue';

const props = defineProps<{
  id: string;
  createdAt: string;
  updatedAt: string;
  savedAt: string;
  publishedAt: string;
}>();

const publishedAtLabel = computed(() => {
  if (props.publishedAt === 'unpublished') return 'UNPUBLISHED';
  return formatDate(props.publishedAt);
});

const primary = computed(() => [
  { label: 'Auto-Saved', value: formatDate(props.savedAt) },
]);

const secondary = computed(() => [
  { label: 'Created', value: formatDate(props.createdAt) },
  { label: 'Last Published', value: publishedAtLabel.value },
  { label: 'Resource ID', value: props.id },
]);
</script>

<template>
  <MetaBox :primary="primary" :secondary="secondary" />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { CampaignMeta } from '../../types';
import { formatDate } from '../shared/helpers';
import MetaBox from '../shared/meta-box.vue';

// TODO: We don't need to Pick stuff  just set them at the CampaignMeta
const props = defineProps<
  Pick<CampaignMeta, 'createdAt' | 'updatedAt'> & {
    id: number;
    savedAt: string;
    publishedAt: string;
  }
>();

const publishedAtLabel = computed(() => {
  if (props.publishedAt === 'unpublished') return 'UNPUBLISHED';
  return formatDate(props.publishedAt);
});

const primary = computed(() => {
  return [{ label: 'Auto-Saved', value: formatDate(props.updatedAt) }];
});

const secondary = computed(() => {
  return [
    { label: 'Created', value: formatDate(props.createdAt) },
    { label: 'Campaign ID', value: props.id.toString() },
    {
      label: 'Status',
      value: publishedAtLabel.value,
    },
  ];
});
</script>

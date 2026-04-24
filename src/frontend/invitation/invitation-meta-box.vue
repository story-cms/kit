<template>
  <MetaBox :primary="primary" :secondary="secondary" />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { InvitationMeta } from '../../types';
import { formatDate } from '../shared/helpers';
import MetaBox from '../shared/meta-box.vue';

const props = defineProps<InvitationMeta & { status: string }>();

const primary = computed(() => {
  return [{ label: 'Auto-Saved', value: formatDate(props.updatedAt) }];
});

const secondary = computed(() => {
  return [
    { label: 'Created', value: formatDate(props.createdAt) },
    { label: 'Invitation ID', value: props.id.toString() },
    {
      label: 'Status',
      value: props.status,
    },
  ];
});
</script>

<template>
  <MetaBox :primary="primary" :secondary="secondary" />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import MetaBox from '../shared/meta-box.vue';
import type { InvitationStats as InvitationStatsType } from '../../types';

const props = defineProps<InvitationStatsType>();

const primary = computed(() => {
  return [{ label: 'Analytics', value: '' }];
});

const secondary = computed(() => {
  return [
    { label: 'Impressions', value: props.impressions.toString() },
    { label: 'Click throughs', value: props.clicks.toString() },
  ];
});
</script>

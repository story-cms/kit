<template>
  <MetaBox :primary="primary" :secondary="secondary" />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import MetaBox from '../shared/meta-box.vue';
import type { InvitationStats as InvitationStatsType } from '../../types';

const props = defineProps<InvitationStatsType>();

const primary = computed(() => {
  return [{ label: 'Impressions', value: props.impressions.toString() }];
});

const secondary = computed(() => {
  return [{ label: 'Click throughs', value: props.clicks.toString() }];
});
</script>

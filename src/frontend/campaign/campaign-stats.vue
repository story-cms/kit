<template>
  <MetaBox :primary="primary" :secondary="secondary" />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import MetaBox from '../shared/meta-box.vue';
import type { CampaignStats as CampaignStatsType } from '../../types';

const props = defineProps<CampaignStatsType>();

const primary = computed(() => {
  return [{ label: 'Impressions', value: props.impressions.toString() }];
});

const secondary = computed(() => {
  return [{ label: 'Clicks throughs', value: props.clicks.toString() }];
});
</script>

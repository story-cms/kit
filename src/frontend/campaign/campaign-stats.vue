<template>
  <MetaBox :primary="primary" :secondary="secondary" />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { CampaignStats } from '../../types';
import MetaBox from '../shared/meta-box.vue';

const props = defineProps<CampaignStats>();

const primary = computed(() => {
  return [{ label: 'Impressions', value: props.impressions.toString() }];
});

const secondary = computed(() => {
  return [{ label: 'Clicks throughs', value: props.clicks.toString() }];
});
</script>

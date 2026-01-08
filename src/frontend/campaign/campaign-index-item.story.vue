<template>
  <Story title="Campaign Index Item" group="campaign">
    <Variant title="With model">
      <CampaignIndexItem :campaign="campaign" />
    </Variant>
    <Variant title="Without title">
      <CampaignIndexItem :campaign="campaignWithoutTitle" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import type { CampaignItem } from '../../types';
import CampaignIndexItem from './campaign-index-item.vue';

const campaign = {
  id: 1,
  title: 'Giving Tuesday',
  regions: 'CX, KE, UG, ZM',
  window: '2026-01-08T02:58:00.000Z|2026-01-24T02:58:00.000Z',
} as CampaignItem;

const campaignWithoutTitle = {
  id: 2,
  regions: 'CX, KE, UG, ZM',
  isPublished: false,
} as CampaignItem;
</script>

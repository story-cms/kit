<template>
  <Story title="Campaign Edit" group="campaign">
    <Variant title="With model" :setup-app="miniSidebar">
      <CampaignEdit
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
        :bundle="campaignBundle"
        :campaign="campaign"
        :providers="{}"
        :stats="stats"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import CampaignEdit from './campaigns-edit.vue';
import type { CampaignBundle, CampaignMeta, CampaignStats } from '../../types';
import { sharedProps, miniSidebar } from '../test/mocks';

const campaignBundle: CampaignBundle = {
  name: 'Giving Tuesday',
  window: '2026-01-08T02:58:00.000Z|2026-01-24T02:58:00.000Z',
  promoImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756122407/christ-chaos-header_yqrufy_lzmfjt.jpg',
  videoUrl: 'https://example.com/hosted/video.mp4',
  title: 'Giving Tuesday - Giving to the Poor',
  message:
    '## Support us further the development of this app\nAll giving should be done freely, not compelled or forced, but offered willingly from the heart.',
  actionLabel: 'Donate',
  actionType: 'donate',
  actionUrl: 'https://www.google.com',
  regions: 'CX, KE, UG, ZM',
};

const campaign: CampaignMeta = {
  id: 1,
  createdAt: '2021-10-10T14:48:00.000000Z',
  updatedAt: '2021-10-10T14:48:00.000000Z',
};

const stats: CampaignStats = {
  impressions: 100,
  clicks: 10,
};
</script>

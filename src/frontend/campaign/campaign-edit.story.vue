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
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import CampaignEdit from './campaign-edit.vue';
import type { CampaignBundle, CampaignMeta } from '../../types';
import { sharedProps, miniSidebar } from '../../frontend/test/mocks';

const campaignBundle: CampaignBundle = {
  name: 'Giving Tuesday',
  startDate: '2025-12-16',
  promoImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756122407/christ-chaos-header_yqrufy_lzmfjt.jpg',
  title: 'Giving Tuesday - Giving to the Poor',
  message:
    '## Support us further the development of this app\nAll giving should be done freely, not compelled or forced, but offered willingly from the heart.',
  actionButton: 'Donate',
  actionType: 'donate',
  actionUrl: 'https://www.google.com',
  regions: 'CX, KE, UG, ZM',
};

const campaign: CampaignMeta = {
  id: 1,
  createdAt: '2021-10-10T14:48:00.000000Z',
  updatedAt: '2021-10-10T14:48:00.000000Z',
};
</script>

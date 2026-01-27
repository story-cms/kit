<template>
  <Story title="Campaigns Index Page" group="campaign">
    <Variant title="Index" :setup-app="miniSidebar">
      <CampaignsIndex
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
        :campaigns="campaigns"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import CampaignsIndex from './campaigns-index.vue';
import { sharedProps, miniSidebar, mockCampaigns } from '../../frontend/test/mocks';
import type { CampaignItem } from '../../types';
import { DateTime } from 'luxon';

const campaigns: CampaignItem[] = mockCampaigns;

// Set the first campaign's window to include today
const now = DateTime.now();
const windowStart = now.minus({ days: 3 }).startOf('day').toISO();
const windowEnd = now.plus({ days: 3 }).endOf('day').toISO();
campaigns[0].window = `${windowStart}|${windowEnd}`;
</script>

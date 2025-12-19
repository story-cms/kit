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
const campaigns: CampaignItem[] = mockCampaigns;
</script>

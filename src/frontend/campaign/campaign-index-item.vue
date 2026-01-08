<template>
  <div class="flex flex-col px-1 py-4 space-y-2 h-full bg-white rounded-md shadow">
    <h3 class="p-2 font-bold text-gray-800 text-base/leading-6">
      <span
        v-if="isLive"
        class="inline-flex flex-wrap gap-1 items-center px-2 py-1 mr-2 text-xs font-medium leading-4 text-green-800 bg-green-100 rounded-full"
        >Live</span
      ><span>
        {{ campaignTitle }}
      </span>
    </h3>
    <div class="w-full text-sm font-medium leading-5 text-gray-500 grow">
      <div class="flex gap-2 items-center px-2 w-full">
        <p class="w-1/6">Start:</p>
        <p>{{ startDate }}</p>
      </div>
      <div class="flex gap-2 items-center px-2 w-full">
        <p class="w-1/6">End:</p>
        <p>{{ endDate }}</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 items-center p-2">
      <div class="flex flex-wrap gap-2 items-center">
        <span
          v-if="isForAllRegions"
          class="inline-flex flex-wrap gap-1 items-center px-2 py-1 text-xs font-medium leading-4 text-blue-800 bg-blue-100 rounded-full"
          >All Regions</span
        >
        <span
          v-for="region in parsedRegions?.slice(0, 5)"
          v-else
          :key="region"
          class="inline-flex flex-wrap gap-1 items-center px-2 py-1 text-xs font-medium leading-4 text-blue-800 bg-blue-100 rounded-full"
          >{{ region }}</span
        >
      </div>
      <div
        v-if="parsedRegions?.length && parsedRegions.length > 5"
        class="text-xs text-gray-500"
      >
        +{{ parsedRegions.length - 5 }} more
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDate, getCampaignStatus } from '../shared/helpers';
import type { CampaignItem } from '../../types';
import { padZero } from '../shared/helpers';

const props = defineProps<{
  campaign: CampaignItem;
}>();

const isForAllRegions = computed(() => {
  if (props.campaign.regions?.length === 0) return true;
  return false;
});

const parsedRegions = computed(() => {
  return props.campaign.regions?.split(',').map((region) => region.trim());
});

const startDate = computed(() => {
  if (!props.campaign.window) return '—';
  return formatDate(props.campaign.window?.split('|')[0])
    .split(' ')[0]
    .replace('-', '/')
    .replace(',', '');
});

const endDate = computed(() => {
  if (!props.campaign.window) return '—';
  return formatDate(props.campaign.window?.split('|')[1])
    .split(' ')[0]
    .replace('-', '/')
    .replace(',', '');
});

// check if the campaign is live
const isLive = computed(() => {
  const status = getCampaignStatus(
    props.campaign.isPublished,
    props.campaign.window ?? '',
  );
  return status === 'Live';
});

const campaignTitle = computed(() =>
  props.campaign.title === null ||
  props.campaign.title === undefined ||
  props.campaign.title === ''
    ? `Campaign ${padZero(props.campaign.id)}`
    : props.campaign.title,
);
</script>

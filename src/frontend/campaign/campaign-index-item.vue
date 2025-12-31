<template>
  <div
    class="grid h-full grid-rows-[min-content_min-content_min-content] space-y-2 rounded-md bg-white px-1 py-4 shadow"
  >
    <h3 class="text-base/leading-6 row-start-1 p-2 font-bold text-gray-800">
      <span
        v-if="isLive"
        class="mr-2 inline-flex flex-wrap items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium leading-4 text-green-800"
        >Live</span
      >{{ campaign.title }}
    </h3>
    <div class="row-span-1 row-start-2 text-sm font-medium leading-5 text-gray-500">
      <div
        v-if="startDate"
        class="grid grow grid-cols-2 px-2 text-sm font-medium leading-5 text-gray-500"
      >
        <p>Start:</p>
        <p class="place-self-end">{{ startDate }}</p>
      </div>
      <div
        v-if="endDate"
        class="grid grow grid-cols-2 px-2 text-sm font-medium leading-5 text-gray-500"
      >
        <p>End:</p>
        <p class="place-self-end">{{ endDate }}</p>
      </div>
    </div>

    <div class="row-span-1 row-start-3 flex flex-wrap items-center gap-2 p-2">
      <div class="flex flex-wrap items-center gap-2">
        <span
          v-if="isForAllRegions"
          class="inline-flex flex-wrap items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium leading-4 text-blue-800"
          >All Regions</span
        >
        <span
          v-for="region in parsedRegions?.slice(0, 5)"
          v-else
          :key="region"
          class="inline-flex flex-wrap items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium leading-4 text-blue-800"
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
import { DateTime } from 'luxon';

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
  if (!props.campaign.window) return '';
  return formatDate(props.campaign.window?.split('|')[0])
    .split(' ')[0]
    .replace('-', '/')
    .replace(',', '');
});

const endDate = computed(() => {
  if (!props.campaign.window) return '';
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
</script>

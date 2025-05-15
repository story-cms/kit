<template>
  <div class="px-3 pt-[30px]">
    <h3 class="font-['Inter'] text-2xl font-semibold leading-8 text-gray-800">
      Analytics
    </h3>
    <dl
      v-if="stats.length > 0"
      class="mt-5 grid grid-cols-1 gap-x-5 divide-gray-200 overflow-hidden rounded-lg md:grid-cols-3"
    >
      <div v-for="item in stats" :key="item.name" class="bg-white py-5 sm:p-6">
        <dt class="text-base font-normal text-gray-900">{{ item.name }}</dt>
        <dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
          <div class="flex items-baseline text-2xl font-semibold leading-8 text-gray-900">
            {{ item.stat }}
            <span class="ml-2 text-sm font-medium text-gray-500"
              >from {{ item.previousStat }}</span
            >
          </div>

          <div
            :class="[
              item.changeType === 'increase'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800',
              'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0',
            ]"
          >
            <Icon
              v-if="item.changeType === 'increase'"
              name="arrow-up"
              class="-ml-1 mr-0.5 size-3 shrink-0 self-center text-green-500"
            />
            <Icon
              v-else
              name="arrow-up"
              class="-ml-1 mr-0.5 size-3 shrink-0 rotate-180 self-center text-red-500"
            />

            <span class="sr-only">
              {{ item.changeType === 'increase' ? 'Increased' : 'Decreased' }} by
            </span>
            {{ item.change }}
          </div>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Icon from '../shared/icon.vue';

import axios from 'axios';

interface Stats {
  name: string;
  stat: number;
  previousStat: number;
  change: string;
  changeType: string;
}

const stats = ref<Stats[]>([]);

const fetchStats = async () => {
  try {
    const response = await axios.get('/api/analytics');
    const data = response.data;

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      const change = ((current - previous) / previous) * 100;
      return {
        change: Math.abs(change).toFixed(2) + '%',
        changeType: change >= 0 ? 'increase' : 'decrease',
      };
    };

    stats.value = [
      {
        name: 'Total Installs',
        stat: data.totalInstallCount.current,
        previousStat: data.totalInstallCount.previous,
        ...calculateChange(
          data.totalInstallCount.current,
          data.totalInstallCount.previous,
        ),
      },
      {
        name: 'Monthly Active Users',
        stat: data.monthlyActiveUsers.current,
        previousStat: data.monthlyActiveUsers.previous,
        ...calculateChange(
          data.monthlyActiveUsers.current,
          data.monthlyActiveUsers.previous,
        ),
      },
      {
        name: 'Chapters Complete',
        stat: data.chaptersCompleteCount.current,
        previousStat: data.chaptersCompleteCount.previous,
        ...calculateChange(
          data.chaptersCompleteCount.current,
          data.chaptersCompleteCount.previous,
        ),
      },
    ];
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};

onMounted(() => {
  fetchStats();
});
</script>

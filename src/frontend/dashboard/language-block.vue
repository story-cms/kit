<template>
  <div
    class="flex max-w-[207px] flex-col rounded-2xl bg-white px-[18px] pb-3 pt-[18px] shadow"
  >
    <div v-if="hasCompleteRings" class="grow">
      <div class="relative mx-auto size-24 rounded-full border-[3px] border-green-500">
        <div class="absolute inset-0 flex items-center justify-center">
          <Icon name="check-large" class="h-auto w-6 text-green-500" />
        </div>
      </div>
      <p class="mt-2 text-center text-xs font-medium leading-4">All done</p>
    </div>
    <div v-else class="flex grow justify-between">
      <Ring
        v-for="item in stats"
        :key="item.name"
        :done="item.done"
        :draft="item.draft"
        :total="item.total"
        :name="item.name"
      />
    </div>
    <div :class="['flex flex-col gap-y-1', hasCompleteRings ? 'mt-3' : 'mt-10']">
      <p class="text-base font-bold leading-6 text-gray-800">
        {{ language }} ({{ locale }})
      </p>
      <p class="text-xs font-medium leading-4 text-gray-500">
        Last update: <span>{{ lastUpdate }}</span>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs, computed } from 'vue';
import Ring from './ring.vue';
import Icon from '../shared/icon.vue';

const props = defineProps<{
  stats: {
    name: string;
    done: number;
    draft: number;
    total: number;
  }[];
  language: string;
  locale: string;
  lastUpdate: string;
}>();

const { stats, language, locale, lastUpdate } = toRefs(props);

const hasCompleteRings = computed(() => {
  return stats.value.every((stat) => stat.done === stat.total);
});
</script>

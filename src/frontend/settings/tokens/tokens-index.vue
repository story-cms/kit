<template>
  <AppLayout title="Settings" subtitle="Manage your AI tokens">
    <template #main>
      <section class="rounded-xl bg-white p-6 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-6 pb-4">
          <div>
            <h3 class="text-xl/7 font-semibold leading-7 text-gray-800">
              Token pot sorter
            </h3>
            <p class="mt-1 max-w-2xl text-sm/5 font-normal leading-5 text-gray-500">
              Distribute tokens from the central pool into language-specific pots. Each
              pot tracks its own allocation and usage.
            </p>
          </div>
          <div class="shrink-0 rounded-lg bg-gray-50 p-4 text-right">
            <p class="text-left text-sm text-gray-500">{{ pots.length }} active pots</p>
            <p class="text-xl font-bold text-black">
              {{ allocatedTotal.toLocaleString() }} allocated
            </p>
          </div>
        </div>
        <TokenPoolSummary
          :pool-total="poolTotal"
          :allocated="allocatedTotal"
          :pot-count="pots.length"
        />

        <TokenPotFilter
          v-model:threshold="filterThreshold"
          v-model:field="filterField"
          class="mt-6"
          :matched-count="filteredPots.length"
        />

        <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <TokenPotCard
            v-for="pot in pagedPots"
            :key="pot.locale"
            :pot="pot"
            @increase="adjustAllocation(pot, STEP)"
            @decrease="adjustAllocation(pot, -STEP)"
          />
        </div>

        <p
          v-if="filteredPots.length === 0"
          class="mt-6 text-center text-sm text-gray-500"
        >
          No languages match this filter.
        </p>
        <p v-else class="mt-6 text-center text-sm text-gray-500">
          Showing {{ startIndex + 1 }}–{{ endIndex }} of
          {{ filteredPots.length }} languages
        </p>

        <Pagination
          v-if="filteredPots.length > itemsPerPage"
          class="mt-2"
          :current-page="currentPage"
          :total-items="filteredPots.length"
          :items-per-page="itemsPerPage"
          @page-change="onPageChange"
        />
      </section>

      <section class="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-6 pb-4">
          <div>
            <h3 class="text-xl/7 font-semibold leading-7 text-gray-800">
              Usage breakdown
            </h3>
            <p class="mt-1 max-w-2xl text-sm/5 font-normal leading-5 text-gray-500">
              Token consumption over the last 7 days.
            </p>
          </div>
          <div class="shrink-0 rounded-lg bg-gray-50 p-4 text-right">
            <p class="text-left text-sm text-gray-500">Last 7 days</p>
            <p class="text-xl font-bold text-black">
              {{ totalTokensUsed.toLocaleString() }} tokens
            </p>
          </div>
        </div>

        <TokenUsageChart :daily-usage="dailyUsage" />
      </section>

      <section class="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-6 pb-4">
          <div>
            <h3 class="text-xl/7 font-semibold leading-7 text-gray-800">
              Transaction history
            </h3>
            <p class="mt-1 max-w-2xl text-sm/5 font-normal leading-5 text-gray-500">
              Recent translation activity and token consumption.
            </p>
          </div>
          <div class="shrink-0 rounded-lg bg-gray-50 p-4 text-right">
            <p class="text-left text-sm text-gray-500">Last 30 days</p>
            <p class="text-xl font-bold text-black">
              {{ transactions.length }} entries
            </p>
          </div>
        </div>

        <TokenTransactionTable :transactions="transactions" />
      </section>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AppLayout from '../../shared/app-layout.vue';
import Pagination from '../../shared/pagination.vue';
import TokenPoolSummary from './components/token-pool-summary.vue';
import TokenPotFilter from './components/token-pot-filter.vue';
import TokenPotCard from './components/token-pot-card.vue';
import TokenUsageChart from './components/token-usage-chart.vue';
import TokenTransactionTable from './components/token-transaction-table.vue';
import type {
  DailyTokenUsage,
  SharedPageProps,
  TokenPot,
  TokenPotField,
  TokenTransaction,
} from '../../../types';
import { useSharedStore } from '../../store';
import { potFieldValue } from './tokens';

const props = defineProps<
  SharedPageProps & {
    poolTotal: number;
    pots: TokenPot[];
    dailyUsage: DailyTokenUsage[];
    transactions: TokenTransaction[];
  }
>();

const shared = useSharedStore();
shared.setFromProps(props);
shared.setCurrentStoryName('');

const STEP = 100;
const itemsPerPage = 12;

const pots = ref<TokenPot[]>([...props.pots]);
const poolTotal = computed(() => props.poolTotal);

const allocatedTotal = computed(() =>
  pots.value.reduce((sum, pot) => sum + pot.allocated, 0),
);

const dailyUsage = computed(() => props.dailyUsage);
const totalTokensUsed = computed(() =>
  dailyUsage.value.reduce((sum, day) => sum + day.tokens, 0),
);

const transactions = computed(() => props.transactions);

const filterThreshold = ref<number | null>(1000);
const filterField = ref<TokenPotField>('remaining');
const currentPage = ref(1);

const filteredPots = computed(() => {
  if (filterThreshold.value === null) return pots.value;
  const threshold = filterThreshold.value;
  return pots.value.filter((pot) => potFieldValue(pot, filterField.value) < threshold);
});

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage, filteredPots.value.length),
);
const pagedPots = computed(() =>
  filteredPots.value.slice(startIndex.value, endIndex.value),
);

watch([filterThreshold, filterField], () => {
  currentPage.value = 1;
});

watch(filteredPots, () => {
  const lastPage = Math.max(1, Math.ceil(filteredPots.value.length / itemsPerPage));
  if (currentPage.value > lastPage) currentPage.value = lastPage;
});

const onPageChange = (page: number) => {
  currentPage.value = page;
};

const adjustAllocation = (pot: TokenPot, delta: number) => {
  const index = pots.value.findIndex((item) => item.locale === pot.locale);
  if (index === -1) return;

  const current = pots.value[index];
  const poolRemaining = Math.max(poolTotal.value - allocatedTotal.value, 0);
  const nextAllocated =
    delta > 0
      ? current.allocated + Math.min(delta, poolRemaining)
      : Math.max(current.used, current.allocated + delta);

  pots.value = pots.value.map((item, i) =>
    i === index ? { ...item, allocated: nextAllocated } : item,
  );
};
</script>
<style scoped>
.debug {
  border: 1px solid red;
}
</style>

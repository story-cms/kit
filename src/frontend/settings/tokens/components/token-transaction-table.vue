<template>
  <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
    <table class="w-full min-w-[720px] table-auto">
      <thead class="border-b border-gray-200 bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500">
            Date
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500">
            Action
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500">
            Language Pair
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500">
            Blocks
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500">
            Tokens Used
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="transaction in pagedTransactions" :key="transaction.date + transaction.action">
          <td class="whitespace-nowrap px-6 py-4 text-sm text-black">
            {{ transaction.date }}
          </td>
          <td class="whitespace-nowrap px-6 py-4 text-sm text-black">
            {{ transaction.action }}
          </td>
          <td class="whitespace-nowrap px-6 py-4 text-sm text-black">
            {{ transaction.sourceLanguage }} → {{ transaction.targetLanguage }}
          </td>
          <td class="whitespace-nowrap px-6 py-4 text-sm text-black">
            {{ transaction.blocks }}
          </td>
          <td class="whitespace-nowrap px-6 py-4 text-sm text-black">
            {{ transaction.tokensUsed.toLocaleString() }}
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination
      v-if="transactions.length > itemsPerPage"
      :current-page="currentPage"
      :total-items="transactions.length"
      :items-per-page="itemsPerPage"
      @page-change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Pagination from '../../../shared/pagination.vue';
import type { TokenTransaction } from '../../../../types';

const props = withDefaults(
  defineProps<{
    transactions: TokenTransaction[];
    itemsPerPage?: number;
  }>(),
  {
    itemsPerPage: 10,
  },
);

const currentPage = ref(1);

const pagedTransactions = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage;
  return props.transactions.slice(start, start + props.itemsPerPage);
});

watch(
  () => props.transactions,
  () => {
    currentPage.value = 1;
  },
);

const onPageChange = (page: number) => {
  currentPage.value = page;
};
</script>

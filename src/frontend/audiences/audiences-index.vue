<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Audiences"> </ContentHeader>
    </template>
    <div>
      <section class="mt-8 flow-root">
        <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="border-2 border-black/5 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50 uppercase">
                  <tr>
                    <th
                      scope="col"
                      class="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Last Login
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="audience in paginatedAudiences" :key="audience.uid">
                    <AudienceRow :audience="audience" />
                  </tr>
                </tbody>
              </table>

              <!-- Pagination -->
              <Pagination
                :current-page="currentPage"
                :total-items="audiences.length"
                :items-per-page="itemsPerPage"
                @page-change="handlePageChange"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import Pagination from '../shared/pagination.vue';

import AudienceRow from './components/audience-row.vue';
import { SharedPageProps, AudiencesProps } from '../../types';
import { useSharedStore } from '../store';

const props = defineProps<AudiencesProps & SharedPageProps>();

const shared = useSharedStore();
shared.setFromProps(props);
shared.setCurrentStoryName('');

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 10;

// Computed properties for pagination
const paginatedAudiences = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return props.audiences.slice(startIndex, endIndex);
});

// Handle page changes
const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

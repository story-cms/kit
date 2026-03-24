<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Audiences">
        <template #actions>
          <button
            v-if="audiences.length > 0"
            type="button"
            :disabled="user.role !== 'admin' || isExporting"
            class="w-32 rounded-[38px] border bg-blue-500 px-[15px] py-[9px] text-center text-sm/5 font-medium text-white opacity-80 shadow focus:outline-none focus:ring focus:ring-indigo-500 active:opacity-80 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset] enabled:hover:bg-blue-400 enabled:hover:shadow-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            @click.prevent="exportAudiences"
          >
            {{ isExporting ? 'Exporting...' : 'Export' }}
          </button>
        </template>
      </ContentHeader>
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
                  <template v-if="isLoading">
                    <tr v-for="i in 5" :key="i" class="animate-pulse">
                      <td class="px-3 py-4">
                        <div class="flex items-center gap-4">
                          <div class="size-11 rounded-full bg-gray-200" />
                          <div class="space-y-2">
                            <div class="h-4 w-32 rounded bg-gray-200" />
                            <div class="h-3 w-48 rounded bg-gray-100" />
                          </div>
                        </div>
                      </td>
                      <td class="px-3 py-4">
                        <div class="h-4 w-24 rounded bg-gray-200" />
                      </td>
                      <td class="px-3 py-4">
                        <div class="h-4 w-24 rounded bg-gray-200" />
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr v-for="audience in paginatedAudiences" :key="audience.uid">
                      <AudienceRow :audience="audience" />
                    </tr>
                  </template>
                </tbody>
              </table>

              <!-- Pagination -->

              <Pagination
                v-if="!isLoading && audiences.length > itemsPerPage"
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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import Pagination from '../shared/pagination.vue';
import AudienceRow from './components/audience-row.vue';

import {
  type SharedPageProps,
  type AudiencesProps,
  type AudienceMeta,
  ResponseStatus,
} from '../../types';
import { useSharedStore } from '../store';

const props = defineProps<AudiencesProps & SharedPageProps>();

const shared = useSharedStore();
shared.setFromProps(props);
shared.setCurrentStoryName('');

const audiences = ref<AudienceMeta[]>([]);
const isLoading = ref(true);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 10;

// Computed properties for pagination
const paginatedAudiences = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return audiences.value.slice(startIndex, endIndex);
});

// Handle page changes
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const exportUrl = computed(() => `/${shared.locale}/audience/export`);
const isExporting = ref(false);

const exportAudiences = async () => {
  isExporting.value = true;

  try {
    const response = await axios.get(exportUrl.value, {
      responseType: 'blob',
    });

    const blob = response.data as Blob;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const disposition = response.headers['content-disposition'];
    const filename =
      disposition?.split('filename=')[1]?.replace(/"/g, '') ?? 'audience_export.csv';
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    shared.addMessage(ResponseStatus.Accomplishment, 'Download started');
  } catch (_e) {
    console.error(_e);
    const message = 'Download failed. Contact support.';
    shared.addMessage(ResponseStatus.Failure, message);
  } finally {
    isExporting.value = false;
  }
};

onMounted(async () => {
  try {
    const { data } = await axios.get<{ audiences: AudienceMeta[] }>(
      `/${shared.locale}/audience/users`,
    );
    audiences.value = data.audiences ?? [];
  } catch {
    audiences.value = [];
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Audiences">
        <template #actions>
          <button
            v-if="showExport"
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
                    <tr v-for="audience in audiences" :key="audience.uid">
                      <AudienceRow :audience="audience" />
                    </tr>
                  </template>
                </tbody>
              </table>

              <div
                v-if="!isLoading && (listMeta.hasPrevious || listMeta.hasMore)"
                class="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 sm:px-6"
              >
                <p class="text-sm text-gray-600">Page {{ currentPageNumber }}</p>
                <div class="flex gap-2">
                  <button
                    type="button"
                    :disabled="!listMeta.hasPrevious || isLoadingPage"
                    class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm enabled:hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    @click="goPrevious"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    :disabled="!listMeta.hasMore || isLoadingPage"
                    class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm enabled:hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    @click="goNext"
                  >
                    Next
                  </button>
                </div>
              </div>
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

import {
  type SharedPageProps,
  type AudienceMeta,
  type AudienceListMeta,
  ResponseStatus,
} from '../../types';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import AudienceRow from './components/audience-row.vue';
import { useSharedStore } from '../store';

const props = defineProps<SharedPageProps>();

const shared = useSharedStore();
shared.setFromProps(props);
shared.setCurrentStoryName('');

const audiences = ref<AudienceMeta[]>([]);
const isLoading = ref(true);
const isLoadingPage = ref(false);

const itemsPerPage = 10;

/** `pageTokens[i]` is the Firebase `pageToken` query param to load page `i + 1` (first page uses `undefined`). */
const pageTokens = ref<(string | undefined)[]>([undefined]);

/** Zero-based index of the current page. */
const currentPageIndex = ref(0);

const listMeta = ref<AudienceListMeta>({
  perPage: itemsPerPage,
  nextPageToken: null,
  hasMore: false,
  hasPrevious: false,
});

const currentPageNumber = computed(() => currentPageIndex.value + 1);

const showExport = computed(
  () => audiences.value.length > 0 || currentPageIndex.value > 0,
);

const usersUrl = computed(() => `/${shared.locale}/audience/users`);

async function loadPage(pageIndex: number) {
  const pageToken = pageTokens.value[pageIndex];
  const { data } = await axios.get<{
    audiences: AudienceMeta[];
    meta: AudienceListMeta;
  }>(usersUrl.value, {
    params: {
      perPage: itemsPerPage,
      ...(pageToken !== undefined ? { pageToken } : {}),
    },
  });

  audiences.value = data.audiences;
  listMeta.value = data.meta;

  const next = data.meta.nextPageToken;
  if (next) {
    pageTokens.value[pageIndex + 1] = next;
  } else {
    pageTokens.value = pageTokens.value.slice(0, pageIndex + 1);
  }
}

async function goNext() {
  if (!listMeta.value.hasMore) return;
  isLoadingPage.value = true;
  try {
    currentPageIndex.value += 1;
    await loadPage(currentPageIndex.value);
  } catch {
    currentPageIndex.value -= 1;
    shared.addMessage(ResponseStatus.Failure, 'Could not load the next page.');
  } finally {
    isLoadingPage.value = false;
  }
}

async function goPrevious() {
  if (!listMeta.value.hasPrevious) return;
  isLoadingPage.value = true;
  try {
    currentPageIndex.value -= 1;
    await loadPage(currentPageIndex.value);
  } catch {
    currentPageIndex.value += 1;
    shared.addMessage(ResponseStatus.Failure, 'Could not load the previous page.');
  } finally {
    isLoadingPage.value = false;
  }
}

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
  } catch (error) {
    console.error(error);
    shared.addMessage(ResponseStatus.Failure, 'Download failed. Contact support.');
  } finally {
    isExporting.value = false;
  }
};

onMounted(async () => {
  try {
    await loadPage(0);
  } catch {
    audiences.value = [];
    listMeta.value = {
      perPage: itemsPerPage,
      nextPageToken: null,
      hasMore: false,
      hasPrevious: false,
    };
  } finally {
    isLoading.value = false;
  }
});
</script>

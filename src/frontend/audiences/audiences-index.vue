<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Audience">
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

                    <th
                      v-for="title in extraColumnTitles"
                      :key="title"
                      scope="col"
                      class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      {{ title }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="audience in audienceRows" :key="audience.uid">
                    <AudienceRow :audience="audience" :extra-columns="extraColumns" />
                  </tr>
                  <tr v-if="loadingMore">
                    <td
                      :colspan="tableColspan"
                      class="py-3 text-center text-sm text-gray-500"
                    >
                      Loading…
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                v-if="cursor != null"
                ref="sentinelRef"
                class="h-2 w-full shrink-0"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import axios from 'axios';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';

import AudienceRow from './components/audience-row.vue';
import type {
  SharedPageProps,
  AudiencesProps,
  AudienceMeta,
  AudiencesUsersPageResponse,
} from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore } from '../store';
import {
  extraAudienceColumns,
  extraAudienceColumnTitles,
} from '../../backend/services/helpers';

const props = defineProps<SharedPageProps & AudiencesProps>();

const extraColumns = computed(() => {
  if (audienceRows.value.length === 0) return [];
  const user = audienceRows.value[0];
  return extraAudienceColumns(user);
});

const tableColspan = computed(() => 3 + extraColumns.value.length);

const extraColumnTitles = computed(() => {
  if (audienceRows.value.length === 0) return [];
  const user = audienceRows.value[0];
  return extraAudienceColumnTitles(user);
});

const audienceRows = ref<AudienceMeta[]>([...props.audiences]);
const cursor = ref<string | null>(props.nextPageToken ?? null);
const loadingMore = ref(false);
const sentinelRef = ref<HTMLElement | null>(null);
let scrollObserver: IntersectionObserver | null = null;

const shared = useSharedStore();
shared.setFromProps(props);
shared.setCurrentStoryName('');

const showExport = computed(() => audienceRows.value.length > 0);

const isExporting = ref(false);

const exportAudiences = async () => {
  isExporting.value = true;

  try {
    const exportUrl = `/${shared.locale}/audience/export`;
    const response = await axios.get(exportUrl, {
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

const resetFromProps = () => {
  audienceRows.value = [...props.audiences];
  cursor.value = props.nextPageToken ?? null;
};

watch(() => [props.audiences, props.nextPageToken] as const, resetFromProps);

const loadMore = async () => {
  if (loadingMore.value || cursor.value == null) return;
  loadingMore.value = true;
  try {
    const { data } = await axios.get<AudiencesUsersPageResponse>(
      `/${shared.locale}/audience/users`,
      { params: { pageToken: cursor.value } },
    );
    audienceRows.value.push(...data.users);
    cursor.value = data.nextPageToken ?? null;
  } catch {
    shared.addMessage(ResponseStatus.Failure, 'Failed to load more audience members.');
  } finally {
    loadingMore.value = false;
  }
};

const attachScrollObserver = () => {
  scrollObserver?.disconnect();
  const el = sentinelRef.value;
  if (!el || cursor.value == null) return;
  scrollObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        void loadMore();
      }
    },
    { root: null, rootMargin: '160px', threshold: 0 },
  );
  scrollObserver.observe(el);
};

const resyncScrollObserver = async () => {
  await nextTick();
  scrollObserver?.disconnect();
  if (cursor.value == null || !sentinelRef.value) return;
  attachScrollObserver();
};

watch([cursor, () => audienceRows.value.length], resyncScrollObserver, {
  flush: 'post',
});

onMounted(() => {
  void resyncScrollObserver();
});

onUnmounted(() => {
  scrollObserver?.disconnect();
});
</script>

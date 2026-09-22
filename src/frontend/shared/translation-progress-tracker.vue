<template>
  <Teleport to="body">
    <div
      v-if="tracker.jobs.length > 0"
      class="fixed bottom-6 right-6 z-40 w-80 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl"
    >
      <h2 class="text-center font-dmsans text-base font-semibold text-black">
        Translation in progress
      </h2>

      <div v-for="group in localeGroups" :key="group.locale" class="mt-4">
        <p class="font-dmsans text-sm font-semibold text-black">{{ group.locale }}</p>

        <div
          v-for="job in group.jobs"
          :key="job.id"
          class="mt-3 flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3">
            <span
              v-if="job.status === 'pending' || job.status === 'processing'"
              class="flex size-6 items-center justify-center"
            >
              <LoaderCircle
                class="size-5 animate-spin text-studio-forest"
                aria-hidden="true"
              />
            </span>
            <span
              v-else-if="job.status === 'complete'"
              class="flex size-6 items-center justify-center rounded-full bg-studio-lime"
            >
              <Check class="size-4 text-studio-forest" aria-hidden="true" />
            </span>
            <span
              v-else
              class="flex size-6 items-center justify-center rounded-full bg-red-100"
            >
              <X class="size-4 text-red-600" aria-hidden="true" />
            </span>

            <div>
              <p class="font-dmsans text-sm font-semibold text-black">
                {{ job.chapterTitle || 'Untitled chapter' }}
              </p>
              <p v-if="job.status === 'failed'" class="font-dmsans text-xs text-red-600">
                Translation failed
              </p>
              <button
                v-else-if="job.status === 'complete'"
                type="button"
                class="font-dmsans text-xs text-gray-500 underline"
                @click="tracker.dismiss(job.id)"
              >
                Dismiss
              </button>
              <p v-else class="font-dmsans text-xs text-gray-500">Translating…</p>
            </div>
          </div>

          <a
            v-if="job.chapterNumber !== null"
            :href="editUrl(job)"
            target="_blank"
            rel="noopener"
            aria-label="Open chapter"
            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <ExternalLink class="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { Check, ExternalLink, LoaderCircle, X } from '@lucide/vue';
import { useTranslationTrackerStore, type TranslationJob } from '../store/translation-tracker';

const tracker = useTranslationTrackerStore();

const localeGroups = computed(() => {
  const byLocale = new Map<string, TranslationJob[]>();
  for (const job of tracker.jobs) {
    const list = byLocale.get(job.locale) ?? [];
    list.push(job);
    byLocale.set(job.locale, list);
  }
  return [...byLocale.entries()].map(([locale, jobs]) => ({ locale, jobs }));
});

const editUrl = (job: TranslationJob) =>
  `/${job.locale}/story/${job.storyId}/draft/${job.chapterNumber}/edit`;

onMounted(() => {
  tracker.subscribe();
});

onUnmounted(() => {
  tracker.unsubscribe();
});
</script>

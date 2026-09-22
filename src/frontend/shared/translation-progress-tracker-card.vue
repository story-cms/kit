<template>
  <Teleport to="body">
    <div
      v-if="jobs.length > 0 && !closed"
      class="fixed bottom-32 right-6 z-40 w-80 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl"
    >
      <div class="flex items-center justify-between">
        <h2 class="font-dmsans text-base font-semibold text-black">
          Translation in progress
        </h2>
        <button
          type="button"
          aria-label="Close"
          class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          @click="closed = true"
        >
          <X class="size-4" aria-hidden="true" />
        </button>
      </div>

      <div v-for="group in localeGroups" :key="group.locale" class="mt-4">
        <p class="font-dmsans text-sm font-semibold text-black">{{ group.locale }}</p>

        <div
          v-for="job in group.jobs"
          :key="job.id"
          class="flex items-center justify-between gap-3 border-b border-gray-100 py-3 last:border-b-0"
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
              <XCircle class="size-4 text-red-600" aria-hidden="true" />
            </span>

            <div>
              <p class="font-dmsans text-sm font-semibold text-black">
                {{ job.chapterTitle || 'Untitled chapter' }}
              </p>
              <p v-if="job.status === 'failed'" class="font-dmsans text-xs text-red-600">
                Translation failed
              </p>
              <button
                v-else-if="job.status === 'complete' && job.canUndo"
                type="button"
                class="font-dmsans text-xs text-gray-500 underline"
                @click="emit('undo', job.id)"
              >
                Undo translation
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
import { computed, ref, watch } from 'vue';
import { Check, ExternalLink, LoaderCircle, X, XCircle } from '@lucide/vue';
import type { TranslationJob } from '../store/translation-tracker';

const props = defineProps<{
  jobs: TranslationJob[];
}>();

const emit = defineEmits<{
  undo: [jobId: number];
}>();

const closed = ref(false);
let seenJobIds = new Set(props.jobs.map((job) => job.id));

// A newly started translation should surface the panel again, even if it
// was previously closed for stale content.
watch(
  () => props.jobs.map((job) => job.id),
  (ids) => {
    if (ids.some((id) => !seenJobIds.has(id))) {
      closed.value = false;
    }
    seenJobIds = new Set(ids);
  },
);

const localeGroups = computed(() => {
  const byLocale = new Map<string, TranslationJob[]>();
  for (const job of props.jobs) {
    const list = byLocale.get(job.locale) ?? [];
    list.push(job);
    byLocale.set(job.locale, list);
  }
  return [...byLocale.entries()].map(([locale, jobs]) => ({ locale, jobs }));
});

const editUrl = (job: TranslationJob) =>
  `/${job.locale}/story/${job.storyId}/draft/${job.chapterNumber}/edit`;
</script>

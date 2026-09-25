<template>
  <Teleport to="body">
    <button
      v-if="jobs.length > 0 && minimized"
      type="button"
      aria-label="Show translation progress"
      class="fixed bottom-32 right-6 z-40 flex size-12 items-center justify-center rounded-full bg-studio-forest text-white shadow-xl transition-colors hover:bg-studio-forest/90"
      @click="minimized = false"
    >
      <LoaderCircle v-if="hasActiveJobs" class="size-5 animate-spin" aria-hidden="true" />
      <Check v-else class="size-5" aria-hidden="true" />
    </button>

    <div
      v-if="jobs.length > 0 && !minimized"
      class="fixed bottom-32 right-6 z-40 w-80 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl"
    >
      <div class="relative flex items-center justify-center">
        <h2 class="text-center font-dmsans text-base font-semibold text-black">
          Translation in progress
        </h2>
        <button
          type="button"
          aria-label="Minimize"
          class="absolute right-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          @click="minimized = true"
        >
          <X class="size-4" aria-hidden="true" />
        </button>
      </div>

      <div v-for="group in localeGroups" :key="group.locale" class="mt-4">
        <p class="font-dmsans text-sm font-semibold text-black">{{ group.localeName }}</p>

        <div
          v-for="job in group.jobs"
          :key="job.id"
          class="flex items-center justify-between gap-3 border-b border-gray-100 py-3 last:border-b-0"
        >
          <div class="flex items-center gap-3">
            <span
              v-if="job.status === 'pending' || job.status === 'processing'"
              class="flex size-12 shrink-0 items-center justify-center"
            >
              <LoaderCircle
                class="size-6 animate-spin text-studio-forest"
                aria-hidden="true"
              />
            </span>
            <span
              v-else-if="job.status === 'complete'"
              class="flex size-12 shrink-0 items-center justify-center rounded-full bg-studio-lime"
            >
              <Check class="size-6 text-studio-forest" aria-hidden="true" />
            </span>
            <span
              v-else
              class="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100"
            >
              <XCircle class="size-6 text-red-600" aria-hidden="true" />
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
                @click="onRequestUndo(job)"
              >
                Undo translation
              </button>
              <p v-else class="font-dmsans text-xs text-gray-500">Translating…</p>
            </div>
          </div>

          <a
            v-if="job.chapterNumber !== null && job.draftId !== currentDraftId"
            :href="editUrl(job)"
            class="inline-flex shrink-0 items-center justify-center rounded-full border border-studio-forest px-6 py-3 font-dmsans text-[15px] font-semibold text-studio-forest transition-colors hover:bg-gray-300"
          >
            Open
          </a>
        </div>
      </div>
    </div>

    <UndoTranslationModal
      :open="pendingUndoJob !== null"
      :chapter-title="pendingUndoJob?.chapterTitle || 'Untitled chapter'"
      :edit-url="pendingUndoJob ? editUrl(pendingUndoJob) : '#'"
      @close="onCancelUndo"
      @confirm="onConfirmUndo"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Check, LoaderCircle, X, XCircle } from '@lucide/vue';
import type { TranslationJob } from '../store/translation-tracker';
import UndoTranslationModal from './undo-translation-modal.vue';

const props = defineProps<{
  jobs: TranslationJob[];
  currentDraftId?: number | null;
}>();

const emit = defineEmits<{
  undo: [jobId: number];
}>();

const minimized = ref(false);
let seenJobIds = new Set(props.jobs.map((job) => job.id));

// A newly started translation should un-minimize the panel, even if it
// was previously minimized for older content.
watch(
  () => props.jobs.map((job) => job.id),
  (ids) => {
    if (ids.some((id) => !seenJobIds.has(id))) {
      minimized.value = false;
    }
    seenJobIds = new Set(ids);
  },
);

const hasActiveJobs = computed(() =>
  props.jobs.some((job) => job.status === 'pending' || job.status === 'processing'),
);

const localeGroups = computed(() => {
  const byLocale = new Map<string, { localeName: string; jobs: TranslationJob[] }>();
  for (const job of props.jobs) {
    const group = byLocale.get(job.locale) ?? { localeName: job.localeName, jobs: [] };
    group.jobs.push(job);
    byLocale.set(job.locale, group);
  }
  return [...byLocale.entries()].map(([locale, group]) => ({ locale, ...group }));
});

const editUrl = (job: TranslationJob) =>
  `/${job.locale}/story/${job.storyId}/draft/${job.chapterNumber}/edit`;

const pendingUndoJob = ref<TranslationJob | null>(null);

const onRequestUndo = (job: TranslationJob) => {
  pendingUndoJob.value = job;
};

const onCancelUndo = () => {
  pendingUndoJob.value = null;
};

const onConfirmUndo = () => {
  if (pendingUndoJob.value === null) return;
  emit('undo', pendingUndoJob.value.id);
  pendingUndoJob.value = null;
};
</script>

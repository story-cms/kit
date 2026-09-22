<template>
  <Story title="Translation Progress Tracker" group="shared">
    <Variant title="Mixed statuses">
      <div class="relative h-96 w-full">
        <p class="text-sm text-gray-500">
          Closing only clears the complete/failed rows — the pending and
          processing ones stay put.
        </p>
        <TranslationProgressTrackerCard
          :jobs="mixedJobs"
          @undo="onUndo(mixedJobs, $event)"
          @dismiss="onDismiss(mixedJobs, $event)"
        />
      </div>
    </Variant>
    <Variant title="Single locale, all in progress">
      <div class="relative h-96 w-full">
        <TranslationProgressTrackerCard
          :jobs="inProgressJobs"
          @undo="onUndo(inProgressJobs, $event)"
          @dismiss="onDismiss(inProgressJobs, $event)"
        />
      </div>
    </Variant>
    <Variant title="Viewing the draft being translated">
      <div class="relative h-96 w-full">
        <p class="text-sm text-gray-500">
          "Hope has come" (draft 3) has no open-chapter link — the viewer is already there.
        </p>
        <TranslationProgressTrackerCard
          :jobs="mixedJobs"
          :current-draft-id="3"
          @undo="onUndo(mixedJobs, $event)"
          @dismiss="onDismiss(mixedJobs, $event)"
        />
      </div>
    </Variant>
    <Variant title="Empty">
      <div class="relative h-96 w-full">
        <p class="text-sm text-gray-500">No jobs — the card renders nothing.</p>
        <TranslationProgressTrackerCard :jobs="[]" @undo="() => {}" @dismiss="() => {}" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import TranslationProgressTrackerCard from './translation-progress-tracker-card.vue';
import type { TranslationJob } from '../store/translation-tracker';

const mixedJobs = reactive<TranslationJob[]>([
  {
    id: 1,
    storyId: 1,
    draftId: 1,
    chapterNumber: 1,
    locale: 'de',
    localeName: 'German',
    chapterTitle: 'Jesus is risen',
    status: 'processing',
    canUndo: false,
    actualTokens: null,
  },
  {
    id: 2,
    storyId: 1,
    draftId: 2,
    chapterNumber: 2,
    locale: 'de',
    localeName: 'German',
    chapterTitle: 'Finding the King',
    status: 'pending',
    canUndo: false,
    actualTokens: null,
  },
  {
    id: 3,
    storyId: 1,
    draftId: 3,
    chapterNumber: 3,
    locale: 'de',
    localeName: 'German',
    chapterTitle: 'Hope has come',
    status: 'complete',
    canUndo: true,
    actualTokens: 842,
  },
  {
    id: 4,
    storyId: 1,
    draftId: 4,
    chapterNumber: 4,
    locale: 'fr',
    localeName: 'French',
    chapterTitle: 'A New Beginning',
    status: 'failed',
    canUndo: false,
    actualTokens: null,
  },
]);

const inProgressJobs = reactive<TranslationJob[]>([
  {
    id: 5,
    storyId: 1,
    draftId: 5,
    chapterNumber: 1,
    locale: 'es',
    localeName: 'Spanish',
    chapterTitle: 'The Good Shepherd',
    status: 'processing',
    canUndo: false,
    actualTokens: null,
  },
  {
    id: 6,
    storyId: 1,
    draftId: 6,
    chapterNumber: 2,
    locale: 'es',
    localeName: 'Spanish',
    chapterTitle: 'Living Water',
    status: 'pending',
    canUndo: false,
    actualTokens: null,
  },
]);

const onUndo = (jobs: TranslationJob[], jobId: number) => {
  const index = jobs.findIndex((job) => job.id === jobId);
  if (index !== -1) jobs.splice(index, 1);
};

const onDismiss = (jobs: TranslationJob[], jobIds: number[]) => {
  jobIds.forEach((jobId) => {
    const index = jobs.findIndex((job) => job.id === jobId);
    if (index !== -1) jobs.splice(index, 1);
  });
};
</script>

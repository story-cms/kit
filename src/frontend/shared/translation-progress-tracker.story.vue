<template>
  <Story title="Translation Progress Tracker" group="shared">
    <Variant title="Mixed statuses">
      <div class="relative h-96 w-full">
        <p class="text-sm text-gray-500">
          Closing minimizes into a floating button — nothing is removed. Click
          it again to restore the panel. "Undo translation" opens a confirmation
          modal before the job is actually undone.
        </p>
        <TranslationProgressTrackerCard :jobs="mixedJobs" @undo="onUndo(mixedJobs, $event)" />
      </div>
    </Variant>
    <Variant title="Single locale, all in progress">
      <div class="relative h-96 w-full">
        <TranslationProgressTrackerCard
          :jobs="inProgressJobs"
          @undo="onUndo(inProgressJobs, $event)"
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
        />
      </div>
    </Variant>
    <Variant title="Empty">
      <div class="relative h-96 w-full">
        <p class="text-sm text-gray-500">No jobs — the card renders nothing.</p>
        <TranslationProgressTrackerCard :jobs="[]" @undo="() => {}" />
      </div>
    </Variant>
    <Variant title="Long titles, Open button on the first job">
      <div class="relative h-96 w-full">
        <p class="text-sm text-gray-500">
          Both chapter titles are long enough to wrap to multiple lines — the status icon
          must stay a perfect circle whether or not that row's Open button is showing.
        </p>
        <TranslationProgressTrackerCard
          :jobs="longTitleJobsComplete"
          :current-draft-id="102"
          @undo="onUndo(longTitleJobsComplete, $event)"
        />
      </div>
    </Variant>
    <Variant title="Long titles, Open button on the second job">
      <div class="relative h-96 w-full">
        <TranslationProgressTrackerCard
          :jobs="longTitleJobsComplete"
          :current-draft-id="101"
          @undo="onUndo(longTitleJobsComplete, $event)"
        />
      </div>
    </Variant>
    <Variant title="Long titles, both jobs show Open">
      <div class="relative h-96 w-full">
        <TranslationProgressTrackerCard
          :jobs="longTitleJobsComplete"
          :current-draft-id="999"
          @undo="onUndo(longTitleJobsComplete, $event)"
        />
      </div>
    </Variant>
    <Variant title="Long titles, in progress">
      <div class="relative h-96 w-full">
        <TranslationProgressTrackerCard
          :jobs="longTitleJobsProcessing"
          :current-draft-id="101"
          @undo="onUndo(longTitleJobsProcessing, $event)"
        />
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

const longTitleJobsComplete = reactive<TranslationJob[]>([
  {
    id: 101,
    storyId: 1,
    draftId: 101,
    chapterNumber: 1,
    locale: 'it',
    localeName: 'Italian: Italiano',
    chapterTitle: 'Depending on God rather than ourselves',
    status: 'complete',
    canUndo: true,
    actualTokens: 842,
  },
  {
    id: 102,
    storyId: 1,
    draftId: 102,
    chapterNumber: 2,
    locale: 'it',
    localeName: 'Italian: Italiano',
    chapterTitle: 'Walking faithfully through seasons of uncertainty',
    status: 'complete',
    canUndo: true,
    actualTokens: 613,
  },
]);

const longTitleJobsProcessing = reactive<TranslationJob[]>([
  {
    id: 103,
    storyId: 1,
    draftId: 101,
    chapterNumber: 1,
    locale: 'it',
    localeName: 'Italian: Italiano',
    chapterTitle: 'Depending on God rather than ourselves',
    status: 'processing',
    canUndo: false,
    actualTokens: null,
  },
  {
    id: 104,
    storyId: 1,
    draftId: 102,
    chapterNumber: 2,
    locale: 'it',
    localeName: 'Italian: Italiano',
    chapterTitle: 'Walking faithfully through seasons of uncertainty',
    status: 'processing',
    canUndo: false,
    actualTokens: null,
  },
]);

const onUndo = (jobs: TranslationJob[], jobId: number) => {
  const index = jobs.findIndex((job) => job.id === jobId);
  if (index !== -1) jobs.splice(index, 1);
};
</script>

<template>
  <Story title="Translation Progress Tracker" group="shared">
    <Variant title="Mixed statuses">
      <div class="relative h-96 w-full">
        <TranslationProgressTrackerCard :jobs="mixedJobs" @dismiss="onDismiss(mixedJobs, $event)" />
      </div>
    </Variant>
    <Variant title="Single locale, all in progress">
      <div class="relative h-96 w-full">
        <TranslationProgressTrackerCard :jobs="inProgressJobs" @dismiss="onDismiss(inProgressJobs, $event)" />
      </div>
    </Variant>
    <Variant title="Empty">
      <div class="relative h-96 w-full">
        <p class="text-sm text-gray-500">No jobs — the card renders nothing.</p>
        <TranslationProgressTrackerCard :jobs="[]" @dismiss="() => {}" />
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
    locale: 'German',
    chapterTitle: 'Jesus is risen',
    status: 'processing',
  },
  {
    id: 2,
    storyId: 1,
    draftId: 2,
    chapterNumber: 2,
    locale: 'German',
    chapterTitle: 'Finding the King',
    status: 'pending',
  },
  {
    id: 3,
    storyId: 1,
    draftId: 3,
    chapterNumber: 3,
    locale: 'German',
    chapterTitle: 'Hope has come',
    status: 'complete',
  },
  {
    id: 4,
    storyId: 1,
    draftId: 4,
    chapterNumber: 4,
    locale: 'French',
    chapterTitle: 'A New Beginning',
    status: 'failed',
  },
]);

const inProgressJobs = reactive<TranslationJob[]>([
  {
    id: 5,
    storyId: 1,
    draftId: 5,
    chapterNumber: 1,
    locale: 'Spanish',
    chapterTitle: 'The Good Shepherd',
    status: 'processing',
  },
  {
    id: 6,
    storyId: 1,
    draftId: 6,
    chapterNumber: 2,
    locale: 'Spanish',
    chapterTitle: 'Living Water',
    status: 'pending',
  },
]);

const onDismiss = (jobs: TranslationJob[], jobId: number) => {
  const index = jobs.findIndex((job) => job.id === jobId);
  if (index !== -1) jobs.splice(index, 1);
};
</script>

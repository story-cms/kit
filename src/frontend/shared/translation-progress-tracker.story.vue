<template>
  <Story title="Translation Progress Tracker" group="shared">
    <Variant title="Mixed statuses" :setup-app="loadData">
      <div class="relative h-96 w-full">
        <TranslationProgressTracker />
      </div>
    </Variant>
    <Variant title="Empty" :setup-app="loadEmpty">
      <div class="relative h-96 w-full">
        <p class="text-sm text-gray-500">No jobs — widget renders nothing.</p>
        <TranslationProgressTracker />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import TranslationProgressTracker from './translation-progress-tracker.vue';
import { useSharedStore, useTranslationTrackerStore } from '../store';
import { sharedProps } from '../test/mocks';
import type { StoryHandler } from './helpers';

const loadData: StoryHandler = (): void => {
  const shared = useSharedStore();
  shared.setFromProps(sharedProps);

  const tracker = useTranslationTrackerStore();
  tracker.jobs = [
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
  ];
};

const loadEmpty: StoryHandler = (): void => {
  const shared = useSharedStore();
  shared.setFromProps(sharedProps);

  const tracker = useTranslationTrackerStore();
  tracker.jobs = [];
};
</script>

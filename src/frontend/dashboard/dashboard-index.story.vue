<template>
  <Story title="Dashboard Index" group="dashboard">
    <Variant title="Index" :setup-app="loadData">
      <DashboardIndex
        :index="[
          {
            number: 1,
            imageUrl:
              'https://res.cloudinary.com/redeem/image/upload/v1752849347/story-cms-ui/placeholder_bafmfz.jpg',
            title: 'Sample Item 1',
            tags: ['tag1', 'tag2'],
          },
          {
            number: 2,
            imageUrl:
              'https://res.cloudinary.com/redeem/image/upload/v1752849347/story-cms-ui/placeholder_bafmfz.jpg',
            title: 'Sample Item 2',
            tags: ['tag3', 'tag4'],
          },
        ]"
        :story-name="sharedProps.config.name"
        :config="sharedProps.config"
        :language="sharedProps.language"
        :user="sharedProps.user"
        :translation-progress="translationProgress"
        :is-read-only="false"
        :exclude="[]"
      />
    </Variant>

    <Variant title="Editor" :setup-app="loadData">
      <DashboardIndex
        :index="[
          {
            number: 1,
            imageUrl:
              'https://res.cloudinary.com/redeem/image/upload/v1752849347/story-cms-ui/placeholder_bafmfz.jpg',
            title: 'Sample Item 1',
            tags: ['tag1', 'tag2'],
          },
          {
            number: 2,
            imageUrl:
              'https://res.cloudinary.com/redeem/image/upload/v1752849347/story-cms-ui/placeholder_bafmfz.jpg',
            title: 'Sample Item 2',
            tags: ['tag3', 'tag4'],
          },
        ]"
        :add-status="AddStatus.Add"
        :story-name="sharedProps.config.name"
        :config="sharedProps.config"
        :language="sharedProps.language"
        :user="{
          ...sharedProps.user,
          isManager: true,
          isAdmin: false,
          role: 'editor',
        }"
        :translation-progress="translationProgress"
        :is-read-only="false"
        :exclude="[]"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { sharedProps, miniSidebar } from '../test/mocks';
import { AddStatus } from '../../types';
import DashboardIndex from './dashboard-index.vue';
import type { StoryHandler } from '../shared/helpers';

const loadData: StoryHandler = ({ app, story, variant }): void => {
  miniSidebar({ app, story, variant });
};

const daysAgo = (days: number): string =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const yesterday = daysAgo(1);
const aboutAWeekAgo = daysAgo(8);
const earlyLastYear = daysAgo(400);
const overAYearAgo = daysAgo(750);

const translationProgress = [
  {
    progress: [
      { name: 'Interface', done: 100, draft: 0, total: 100, lastUpdated: yesterday },
      { name: 'Content', done: 35, draft: 15, total: 100, lastUpdated: yesterday },
    ],
    language: 'German',
    locale: 'de',
    isReadOnly: false,
  },
  {
    progress: [
      { name: 'Interface', done: 100, draft: 0, total: 100, lastUpdated: earlyLastYear },
      { name: 'Content', done: 200, draft: 0, total: 200, lastUpdated: earlyLastYear },
    ],
    language: 'Francais',
    locale: 'fr',
    isReadOnly: false,
  },
  {
    progress: [
      { name: 'Interface', done: 100, draft: 0, total: 100, lastUpdated: earlyLastYear },
      { name: 'Content', done: 150, draft: 0, total: 150, lastUpdated: earlyLastYear },
    ],
    language: 'Latviešu',
    locale: 'lv',
    isReadOnly: false,
  },
  {
    progress: [
      { name: 'Interface', done: 100, draft: 0, total: 100, lastUpdated: aboutAWeekAgo },
      { name: 'Content', done: 70, draft: 30, total: 100, lastUpdated: aboutAWeekAgo },
    ],
    language: 'Español',
    locale: 'es',
    isReadOnly: false,
  },
  {
    progress: [
      { name: 'Interface', done: 100, draft: 0, total: 100, lastUpdated: yesterday },
      { name: 'Content', done: 35, draft: 15, total: 100, lastUpdated: yesterday },
    ],
    language: 'Hindi',
    locale: 'hi',
    isReadOnly: false,
  },
  {
    progress: [
      { name: 'Interface', done: 75, draft: 0, total: 100, lastUpdated: yesterday },
      { name: 'Content', done: 50, draft: 0, total: 100, lastUpdated: yesterday },
    ],
    language: 'Swiss German Alemanni',
    locale: 'gsw',
    isReadOnly: false,
  },
  {
    progress: [
      { name: 'Interface', done: 100, draft: 0, total: 100, lastUpdated: yesterday },
      { name: 'Content', done: 80, draft: 20, total: 100, lastUpdated: yesterday },
    ],
    language: 'Japanese',
    locale: 'ja',
    isReadOnly: false,
  },
  {
    // done: 1 (not 0) keeps `done !== total` so language-block.vue doesn't
    // treat this trivially-equal 0-total pair as "all done"; total: 0 gives
    // each ring's blank/no-data look.
    progress: [
      { name: 'Interface', done: 1, draft: 0, total: 0, lastUpdated: overAYearAgo },
      { name: 'Content', done: 1, draft: 0, total: 0, lastUpdated: overAYearAgo },
    ],
    language: 'Korean',
    locale: 'ko',
    isReadOnly: false,
  },
  {
    progress: [
      { name: 'Interface', done: 75, draft: 0, total: 100, lastUpdated: yesterday },
      { name: 'Content', done: 100, draft: 0, total: 200, lastUpdated: yesterday },
    ],
    language: 'Marathi',
    locale: 'mr',
    isReadOnly: false,
  },
  {
    progress: [
      { name: 'Interface', done: 100, draft: 0, total: 100, lastUpdated: yesterday },
      { name: 'Content', done: 35, draft: 15, total: 100, lastUpdated: yesterday },
    ],
    language: 'Portuguese',
    locale: 'pt',
    isReadOnly: false,
  },
  {
    progress: [
      { name: 'Interface', done: 0, draft: 0, total: 0, lastUpdated: '' },
      { name: 'Content', done: 0, draft: 0, total: 0, lastUpdated: '' },
    ],
    language: 'Cantonese',
    locale: 'yue',
    isReadOnly: false,
  },
];
</script>

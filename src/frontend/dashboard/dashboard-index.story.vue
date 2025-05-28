<template>
  <Story title="Dashboard Index">
    <Variant title="Index">
      <DashboardIndex
        :index="[
          {
            number: 1,
            imageUrl:
              'https://res.cloudinary.com/onesheep/image/upload/v1684754051/Screenshot_2023-05-22_at_13.12.03_pnamdt.png',
            title: 'Sample Item 1',
            tags: ['tag1', 'tag2'],
          },
          {
            number: 2,
            imageUrl:
              'https://res.cloudinary.com/onesheep/image/upload/v1684754051/Screenshot_2023-05-22_at_13.12.03_pnamdt.png',
            title: 'Sample Item 2',
            tags: ['tag3', 'tag4'],
          },
        ]"
        :add-status="AddStatus.Add"
        :story-name="sharedProps.meta.name"
        :meta="sharedProps.meta"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :user="{
          id: 1,
          name: 'Test User',
          initials: 'TU',
          email: 'test@example.com',
          isManager: false,
          isAdmin: false,
          role: 'user',
          language: 'en',
        }"
        :stories="sharedProps.stories"
        :ui-todo-count="sharedProps.uiTodoCount"
        :stats="[
          {
            name: 'Total Stories',
            stat: '71,897',
            previousStat: '70,946',
            change: '12%',
            changeType: 'increase',
          },
          {
            name: 'Avg. Open Rate',
            stat: '58.16%',
            previousStat: '56.14%',
            change: '2.02%',
            changeType: 'increase',
          },
          {
            name: 'Avg. Click Rate',
            stat: '24.57%',
            previousStat: '28.62%',
            change: '4.05%',
            changeType: 'decrease',
          },
        ]"
        :translation-progress="translationProgress"
      />
    </Variant>
    <Variant title="Ring">
      <div class="flex w-full p-8 mx-auto bg-white rounded-lg gap-x-4">
        <Ring
          :done="10"
          :draft="10"
          :total="100"
          :name="'Interface'"
          :last-updated="new Date('2025-05-19T15:05:30.732+00:00').toLocaleDateString()"
        />
        <Ring
          :done="200"
          :draft="50"
          :total="300"
          :name="'Content'"
          :last-updated="new Date('2025-05-19T15:05:30.732+00:00').toLocaleDateString()"
        />
      </div>
    </Variant>
    <Variant title="Language block">
      <LanguageBlock
        :progress="[
          {
            name: 'English',
            done: 10,
            draft: 10,
            total: 100,
            lastUpdated: '2025-05-19T15:05:30.732+00:00',
          },
          {
            name: 'French',
            done: 200,
            draft: 50,
            total: 300,
            lastUpdated: '2025-05-19T15:05:30.732+00:00',
          },
        ]"
        :language="'German'"
        :locale="'de'"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { sharedProps } from '../test/mocks';
import { AddStatus } from '../../types';
import DashboardIndex from './dashboard-index.vue';
import Ring from './ring.vue';
import LanguageBlock from './language-block.vue';

const translationProgress = [
  {
    progress: [
      {
        name: 'Interface',
        done: 100,
        draft: 0,
        total: 100,
        lastUpdated: '2025-04-10 15:22:16.448+03',
      },
      {
        name: 'Content',
        done: 200,
        draft: 0,
        total: 200,
        lastUpdated: '2025-04-10 15:22:16.448+03',
      },
    ],
    language: 'German',
    locale: 'de',
  },
  {
    progress: [
      {
        name: 'Interface',
        done: 75,
        draft: 0,
        total: 100,
        lastUpdated: '2025-04-10 15:22:16.448+03',
      },
      {
        name: 'Content',
        done: 150,
        draft: 50,
        total: 200,
        lastUpdated: '2025-04-10 15:22:16.448+03',
      },
    ],
    language: 'Bengali',
    locale: 'bn',
  },
];
</script>

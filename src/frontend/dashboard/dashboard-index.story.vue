<template>
  <Story title="Dashboard Index" group="dashboard">
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
          name: 'Site Admin',
          initials: 'TU',
          email: 'test@example.com',
          isManager: true,
          isAdmin: true,
          role: 'admin',
          language: '*',
          hasPendingInvite: false,
        }"
        :stories="sharedProps.stories"
        :ui-todo-count="sharedProps.uiTodoCount"
        :translation-progress="translationProgress"
        :is-read-only="false"
      />
    </Variant>
    <Variant title="Editor">
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
          name: 'English Editor User',
          initials: 'TU',
          email: 'test@example.com',
          isManager: true,
          isAdmin: false,
          role: 'editor',
          language: '*',
          hasPendingInvite: false,
        }"
        :stories="sharedProps.stories"
        :ui-todo-count="sharedProps.uiTodoCount"
        :translation-progress="translationProgress"
        :is-read-only="false"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { sharedProps } from '../test/mocks';
import { AddStatus } from '../../constants';
import DashboardIndex from './dashboard-index.vue';

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
    isReadOnly: false,
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
    isReadOnly: false,
  },
];
</script>

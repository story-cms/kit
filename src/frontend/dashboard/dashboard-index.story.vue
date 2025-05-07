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
        :stories="[]"
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
        :ui-todo-count="0"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { sharedProps } from '../test/mocks';
import { AddStatus } from '../../types';
import DashboardIndex from './dashboard-index.vue';
</script>

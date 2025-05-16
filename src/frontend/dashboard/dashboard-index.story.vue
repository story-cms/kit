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
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { sharedProps } from '../test/mocks';
import { AddStatus } from '../../types';
import DashboardIndex from './dashboard-index.vue';
</script>

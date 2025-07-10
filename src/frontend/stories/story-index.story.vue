<template>
  <Story title="Story Index" group="stories">
    <Variant title="Index">
      <StoryIndex
        :index="[
          {
            number: 1,
            imageUrl:
              'https://res.cloudinary.com/onesheep/image/upload/v1684754051/Screenshot_2023-05-22_at_13.12.03_pnamdt.png',
            title: 'Sample Item 1',
            tags: ['Live', 'Draft'],
          },
          {
            number: 2,
            imageUrl:
              'https://res.cloudinary.com/onesheep/image/upload/v1684754051/Screenshot_2023-05-22_at_13.12.03_pnamdt.png',
            title: 'Sample Item 2',
            tags: ['Live'],
          },
        ]"
        :add-status="AddStatus.Add"
        story-name="John"
        :story-id="1"
        :meta="sharedProps.meta"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :stories="['John', 'Luke']"
        :user="{
          id: 1,
          name: 'Test User',
          initials: 'TU',
          email: 'test@example.com',
          isManager: false,
          isAdmin: false,
          role: 'user',
          language: 'en',
          hasPendingInvite: false,
        }"
        :ui-todo-count="0"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { sharedProps } from '../test/mocks';
import { AddStatus } from '../../constants';
import StoryIndex from './story-index.vue';
</script>

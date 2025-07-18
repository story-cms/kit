<template>
  <Story title="Story Index" group="stories">
    <Variant title="Index">
      <StoryIndex
        :index="[
          {
            number: 1,
            imageUrl:
              'https://res.cloudinary.com/redeem/image/upload/v1752849347/story-cms-ui/placeholder_bafmfz.jpg',
            title: 'Sample Item 1',
            tags: ['Live', 'Draft'],
          },
          {
            number: 2,
            imageUrl:
              'https://res.cloudinary.com/redeem/image/upload/v1752849347/story-cms-ui/placeholder_bafmfz.jpg',
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
import { AddStatus } from '../../types';
import StoryIndex from './story-index.vue';
</script>

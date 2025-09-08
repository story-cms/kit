<template>
  <Story title="Story Index" group="stories">
    <Variant title="Index" :setup-app="miniSidebar">
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
        :meta="sharedProps.meta"
        :user="user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :add-status="AddStatus.Add"
        :story="story"
        :bookmarks="sharedProps.bookmarks"
        :exclude="['streams']"
        :can-edit-story="true"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { sharedProps, story, user, miniSidebar } from '../test/mocks';
import { AddStatus } from '../../types';
import StoryIndex from './story-index.vue';
</script>

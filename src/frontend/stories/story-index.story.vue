<template>
  <Story title="Story Index" group="stories">
    <Variant title="Index" :setup-app="miniSidebar">
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
        :meta="sharedProps.meta"
        :user="user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :add-status="AddStatus.Add"
        :story="story"
        :stories="['John', 'Luke']"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { sharedProps, story, user, miniSidebar } from '../test/mocks';
import { AddStatus } from '../../types';
import StoryIndex from './story-index.vue';
</script>

<template>
  <Story title="Story Index" group="stories">
    <Variant title="Index" :setup-app="miniSidebar">
      <StoryIndex
        :index="indexItems"
        :config="sharedProps.config"
        :user="user"
        :language="sharedProps.language"
        :add-status="AddStatus.Add"
        :story="storyMock"
        :bookmarks="sharedProps.bookmarks"
        :can-edit-story="true"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { sharedProps, user, miniSidebar } from '../test/mocks';
import { AddStatus } from '../../types';
import type { IndexReadyItem, StorySpec } from '../../types';
import StoryIndex from './story-index.vue';

const storyMock: StorySpec = {
  id: 1,
  name: 'Classic',
  coverImage:
    'https://res.cloudinary.com/theword121/image/upload/v1687245360/episodes/viseg2hegowcrapio6pt.svg',
  chapterLimit: 42,
  chapterType: 'Day',
  storyType: 'Edition',
  schemaVersion: 1,
  fields: [],
  sections: [],
};

const indexItems: IndexReadyItem[] = [
  ...Array.from({ length: 5 }, (_, i) => ({
    number: i + 1,
    imageUrl:
      'https://res.cloudinary.com/redeem/image/upload/v1752849347/story-cms-ui/placeholder_bafmfz.jpg',
    title: `Day ${i + 1}`,
    tags: i === 0 ? (['Live', 'Draft'] as string[]) : (['Live'] as string[]),
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    number: i + 6,
    imageUrl:
      'https://res.cloudinary.com/redeem/image/upload/v1752849347/story-cms-ui/placeholder_bafmfz.jpg',
    title: `Draft Day ${i + 6}`,
    tags: ['Draft'] as string[],
  })),
];
</script>

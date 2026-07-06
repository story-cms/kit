<template>
  <Story title="Story Index" group="stories">
    <Variant title="Unpublished" :setup-app="miniSidebar">
      <StoryIndex
        :index="indexItems"
        :config="sharedProps.config"
        :user="user"
        :language="sharedProps.language"
        :add-status="AddStatus.Add"
        :story="unpublishedStory"
        :bookmarks="sharedProps.bookmarks"
        :can-edit-story="true"
      />
    </Variant>
    <Variant title="Published" :setup-app="miniSidebar">
      <StoryIndex
        :index="indexItems"
        :config="sharedProps.config"
        :user="user"
        :language="sharedProps.language"
        :add-status="AddStatus.Add"
        :story="publishedStory"
        :bookmarks="sharedProps.bookmarks"
        :can-edit-story="true"
      />
    </Variant>
    <Variant title="Ready to publish" :setup-app="miniSidebar">
      <StoryIndex
        :index="readyToPublishIndex"
        :config="sharedProps.config"
        :user="user"
        :language="sharedProps.language"
        :add-status="AddStatus.Add"
        :story="readyToPublishStory"
        :bookmarks="sharedProps.bookmarks"
        :can-edit-story="true"
      />
    </Variant>
    <Variant title="Missing chapters" :setup-app="miniSidebar">
      <StoryIndex
        :index="missingChaptersIndex"
        :config="sharedProps.config"
        :user="user"
        :language="sharedProps.language"
        :add-status="AddStatus.Add"
        :story="missingChaptersStory"
        :bookmarks="sharedProps.bookmarks"
        :can-edit-story="true"
      />
    </Variant>
    <Variant title="Missing metadata" :setup-app="miniSidebar">
      <StoryIndex
        :index="readyToPublishIndex"
        :config="sharedProps.config"
        :user="user"
        :language="sharedProps.language"
        :add-status="AddStatus.Add"
        :story="missingMetadataStory"
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

const placeholderImage =
  'https://res.cloudinary.com/redeem/image/upload/v1752849347/story-cms-ui/placeholder_bafmfz.jpg';

const storyMock: StorySpec = {
  id: 1,
  name: 'Classic',
  coverImage:
    'https://res.cloudinary.com/theword121/image/upload/v1687245360/episodes/viseg2hegowcrapio6pt.svg',
  chapterLimit: 42,
  chapterType: 'Day',
  storyType: 'Edition',
  visibility: 'public',
  schemaVersion: 1,
  isPublished: false,
  fields: [],
  sections: [],
};

const unpublishedStory: StorySpec = {
  ...storyMock,
  isPublished: false,
};

const publishedStory: StorySpec = {
  ...storyMock,
  isPublished: true,
};

const indexWithLiveCount = (liveCount: number, chapterLimit: number): IndexReadyItem[] => {
  const liveItems = Array.from({ length: liveCount }, (_, i) => ({
    number: i + 1,
    imageUrl: placeholderImage,
    title: `Day ${i + 1}`,
    tags: ['Live'] as string[],
  }));

  const draftItems = Array.from({ length: Math.max(0, chapterLimit - liveCount) }, (_, i) => ({
    number: liveCount + i + 1,
    imageUrl: placeholderImage,
    title: `Draft Day ${liveCount + i + 1}`,
    tags: ['Draft'] as string[],
  }));

  return [...liveItems, ...draftItems];
};

const readyToPublishStory: StorySpec = {
  ...storyMock,
  chapterLimit: 5,
  isPublished: false,
};

const missingChaptersStory: StorySpec = {
  ...readyToPublishStory,
};

const missingMetadataStory: StorySpec = {
  ...readyToPublishStory,
  coverImage: '',
  storyType: '',
};

const readyToPublishIndex = indexWithLiveCount(5, 5);
const missingChaptersIndex = indexWithLiveCount(3, 5);

const indexItems: IndexReadyItem[] = [
  ...Array.from({ length: 5 }, (_, i) => ({
    number: i + 1,
    imageUrl: placeholderImage,
    title: `Day ${i + 1}`,
    tags: i === 0 ? (['Live', 'Draft'] as string[]) : (['Live'] as string[]),
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    number: i + 6,
    imageUrl: placeholderImage,
    title: `Draft Day ${i + 6}`,
    tags: ['Draft'] as string[],
  })),
];
</script>

<docs lang="md">
# Story Index

## Variants

- **Unpublished** — Edit and Publish actions; Publish disabled when Live count is below chapter limit
- **Published** — Edit only; Publish hidden
- **Ready to publish** — 5 Live items matching a chapter limit of 5; Publish enabled
- **Missing chapters** — 3 Live items with a chapter limit of 5; Publish disabled with a `StudioButton` tooltip explaining how many chapters are still needed.
- **Missing metadata** — 5 Live items matching chapter limit, but blank cover image and story type; Publish disabled with a metadata tooltip.
</docs>

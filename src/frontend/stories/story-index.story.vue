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
        :index="publishedIndex"
        :config="sharedProps.config"
        :user="user"
        :language="sharedProps.language"
        :add-status="AddStatus.Full"
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
        :add-status="AddStatus.Full"
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
        :add-status="AddStatus.Full"
        :story="missingMetadataStory"
        :bookmarks="sharedProps.bookmarks"
        :can-edit-story="true"
      />
    </Variant>
    <Variant title="Awaiting source translation" :setup-app="miniSidebar">
      <StoryIndex
        :index="awaitingSourceIndex"
        :config="sharedProps.config"
        :user="user"
        :language="sharedProps.language"
        :add-status="AddStatus.Wait"
        :story="awaitingSourceStory"
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

const readyToPublishStory: StorySpec = {
  ...storyMock,
  chapterLimit: 5,
  isPublished: false,
};

const publishedStory: StorySpec = {
  ...readyToPublishStory,
  isPublished: true,
};

const publishedIndex: IndexReadyItem[] = Array.from({ length: 5 }, (_, i) => ({
  number: i + 1,
  imageUrl: placeholderImage,
  title: `Day ${i + 1}`,
  tags: i === 0 ? (['Live', 'Draft'] as string[]) : (['Live'] as string[]),
}));

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

const missingChaptersStory: StorySpec = {
  ...readyToPublishStory,
};

const missingMetadataStory: StorySpec = {
  ...readyToPublishStory,
  coverImage: '',
  storyType: '',
};

const awaitingSourceStory: StorySpec = {
  ...storyMock,
  chapterLimit: 10,
  isPublished: false,
};

const readyToPublishIndex = indexWithLiveCount(5, 5);
const missingChaptersIndex = indexWithLiveCount(3, 5);
const awaitingSourceIndex = indexWithLiveCount(3, 10);

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

- **Unpublished** — **Ready** / **Draft** tabs; Edit and Publish actions; Publish disabled when ready count is below chapter limit; Day 01 shows **Changed** on Ready tab
- **Published** — **Live** / **Changes** tabs; story met all publish prerequisites (5 of 5 Live chapters, full metadata); Edit only, Publish hidden, add button hidden (`AddStatus.Full`); Day 01 shows **Changed** on Live tab and **Changes** on Changes tab
- **Ready to publish** — **Ready** / **Draft** tabs; 5 ready items matching a chapter limit of 5; Publish enabled; add button hidden
- **Missing chapters** — **Ready** / **Draft** tabs; 3 ready items with a chapter limit of 5; Publish disabled with a `StudioButton` tooltip explaining how many chapters are still needed.
- **Missing metadata** — **Ready** / **Draft** tabs; 5 ready items matching chapter limit, but blank cover image and story type; Publish disabled with a metadata tooltip.
- **Awaiting source translation** — **Ready** / **Draft** tabs; translation locale waiting for source chapters; add button replaced by a message: "No more Days available to translate" (`AddStatus.Wait`).
</docs>

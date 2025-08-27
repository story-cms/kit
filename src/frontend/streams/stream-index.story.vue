<template>
  <Story title="Stream Index" group="streams">
    <Variant title="Default" :setup-app="loadData">
      <StreamIndex
        :stream="stream"
        :drops="drops"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
      />
    </Variant>

    <Variant title="With Live Drops" :setup-app="loadLiveData">
      <StreamIndex
        :stream="stream"
        :drops="liveDrops"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
      />
    </Variant>

    <Variant title="With Draft Drops" :setup-app="loadDraftData">
      <StreamIndex
        :stream="stream"
        :drops="draftDrops"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
      />
    </Variant>

    <Variant title="Empty State" :setup-app="loadEmptyData">
      <StreamIndex
        :stream="stream"
        :drops="[]"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StreamIndex from './stream-index.vue';
import { sharedProps, miniSidebar } from '../test/mocks';
import type { StoryHandler } from '../shared/helpers';
import type { StreamIndexItem, DropIndexItem } from '../../types';

const stream: StreamIndexItem = {
  id: 1,
  title: 'Daily Devotions',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756122586/boats_uewaxo.jpg',
  latestReleaseAt: '2024-01-15T10:00:00Z',
  count: 5,
};

const drops: DropIndexItem[] = [
  {
    id: 1,
    title: 'Morning Prayer',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
    releaseAt: '2024-01-15T10:00:00Z',
    isPublished: true,
  },
  {
    id: 2,
    title: 'Evening Reflection',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756123316/Acts_ggpfgy.webp',
    releaseAt: '2024-01-14T18:00:00Z',
    isPublished: true,
  },
  {
    id: 3,
    title: 'Midday Meditation',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756123453/alabaster-co-rlb3upCBLck-unsplash_emiapj.jpg',
    releaseAt: '2024-01-13T12:00:00Z',
    isPublished: false,
  },
  {
    id: 4,
    title: 'Weekly Review',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756123097/top5_psalms_ddl7c0.jpg',
    releaseAt: '2024-01-12T09:00:00Z',
    isPublished: true,
  },
  {
    id: 5,
    title: 'Special Edition',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
    releaseAt: '2024-01-11T15:00:00Z',
    isPublished: false,
  },
];

const liveDrops: DropIndexItem[] = drops.filter((drop) => drop.isPublished);
const draftDrops: DropIndexItem[] = drops.filter((drop) => !drop.isPublished);

const loadData: StoryHandler = ({ app, story, variant }): void => {
  miniSidebar({ app, story, variant });
};

const loadLiveData: StoryHandler = ({ app, story, variant }): void => {
  miniSidebar({ app, story, variant });
};

const loadDraftData: StoryHandler = ({ app, story, variant }): void => {
  miniSidebar({ app, story, variant });
};

const loadEmptyData: StoryHandler = ({ app, story, variant }): void => {
  miniSidebar({ app, story, variant });
};
</script>

<docs lang="md">
# Stream Index

A page component that displays a collection of drops (content items) for a specific stream. It includes filtering, sorting, and search functionality.

## Features

- **List/Grid View Toggle**: Switch between list and grid layouts
- **Filtering**: Filter drops by Live/Draft status
- **Search**: Search drops by title
- **Sorting**: Sort by release date (ascending/descending)
- **Add New Drop**: Quick access to create new drops
- **Responsive Design**: Adapts to different screen sizes

## Props

- `stream` - Stream information (id, title, coverImage, etc.)
- `drops` - Array of drop items to display
- `meta` - CMS metadata
- `user` - Current user information
- `languages` - Available languages
- `language` - Current language
- `errors` - Error state
- `bookmarks` - Available bookmarks array
- `exclude` - Exclude nav bar elements

## Variants

- **Default** - Shows mixed live and draft drops
- **With Live Drops** - Shows only published drops
- **With Draft Drops** - Shows only unpublished drops
- **Empty State** - Shows no drops
- **RTL** - Right-to-left language support

## Usage

```vue
<StreamIndex
  :stream="streamData"
  :drops="dropsData"
  :meta="metaData"
  :user="userData"
  :languages="languages"
  :language="currentLanguage"
  :errors="errors"
  :bookmarks="bookmarks"
  :exclude="[]"
/>
```
</docs>

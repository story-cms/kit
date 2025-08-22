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
        :stories="['John', 'Acts']"
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
        :stories="['John', 'Acts']"
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
        :stories="['John', 'Acts']"
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
        :stories="['John', 'Acts']"
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
  coverImage: 'https://res.cloudinary.com/onesheep/image/upload/v1684754051/Screenshot_2023-05-22_at_13.12.03_pnamdt.png',
  latestReleaseAt: '2024-01-15T10:00:00Z',
  count: 5
};

const drops: DropIndexItem[] = [
  {
    id: 1,
    title: 'Morning Prayer',
    coverImage: 'https://res.cloudinary.com/onesheep/image/upload/v1669793982/cld-sample-2.jpg',
    releaseAt: '2024-01-15T10:00:00Z',
    isPublished: true
  },
  {
    id: 2,
    title: 'Evening Reflection',
    coverImage: 'https://images.squarespace-cdn.com/content/v1/58b7381929687f370cca699f/1610478690174-1LWISFW07OS4FNS50JJ9/Acts.jpg?format=1500w',
    releaseAt: '2024-01-14T18:00:00Z',
    isPublished: true
  },
  {
    id: 3,
    title: 'Midday Meditation',
    coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDtJ_K1JoXAlqyLGMVaS76p_ST6h44uFLwZzhogDajoi9gQv1PydXjzI0vXmEPpGxCZ58&usqp=CAU',
    releaseAt: '2024-01-13T12:00:00Z',
    isPublished: false
  },
  {
    id: 4,
    title: 'Weekly Review',
    coverImage: 'https://store.christianitytoday.com/cdn/shop/articles/top5_psalms.jpg?v=1715353188',
    releaseAt: '2024-01-12T09:00:00Z',
    isPublished: true
  },
  {
    id: 5,
    title: 'Special Edition',
    coverImage: 'https://res.cloudinary.com/onesheep/image/upload/v1669793982/cld-sample-2.jpg',
    releaseAt: '2024-01-11T15:00:00Z',
    isPublished: false
  }
];




const liveDrops: DropIndexItem[] = drops.filter(drop => drop.isPublished);
const draftDrops: DropIndexItem[] = drops.filter(drop => !drop.isPublished);

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
/>
```
</docs>

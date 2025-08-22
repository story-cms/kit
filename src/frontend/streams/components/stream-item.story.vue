<template>
  <Story title="Stream Item" group="streams">
    <Variant title="Grid View">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <StreamItem :stream="streamData" :is-list="false" />
        <StreamItem :stream="streamDataBehind" :is-list="false" />
        <StreamItem :stream="streamDataAhead" :is-list="false" />
      </div>
    </Variant>

    <Variant title="List View">
      <div class="space-y-2 p-4">
        <StreamItem :stream="streamData" :is-list="true" />
        <StreamItem :stream="streamDataBehind" :is-list="true" />
        <StreamItem :stream="streamDataAhead" :is-list="true" />
      </div>
    </Variant>

    <Variant title="With Bookmark" :setup-app="setupBookmark">
      <div class="p-4">
        <StreamItem :stream="streamData" :is-list="false" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { StreamIndexItem } from '../../../types';
import StreamItem from './stream-item.vue';
import { useSharedStore } from '../../store';
import type { StoryHandler } from '../../shared/helpers';

const streamData: StreamIndexItem = {
  id: 1,
  title: 'Daily Devotional',
  coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  latestReleaseAt: new Date().toISOString(),
  count: 42,
};

const streamDataBehind: StreamIndexItem = {
  id: 2,
  title: 'Weekly Bible Study',
  coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
  latestReleaseAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  count: 15,
};

const streamDataAhead: StreamIndexItem = {
  id: 3,
  title: 'Monthly Reflection',
  coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  latestReleaseAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  count: 8,
};

const setupBookmark: StoryHandler = (): void => {
  const shared = useSharedStore();
  shared.bookmarks = [
    {
      label: 'Daily Devotional',
      link: '/en/stream/1',
    },
  ];
};
</script>

<docs lang="md">
# Stream Item

A component for displaying stream items in both grid and list view modes.

## Features

- **Grid View**: Card-style layout with larger cover image
- **List View**: Compact horizontal layout for lists
- **Bookmark Support**: Shows bookmark action on hover
- **Status Indicators**: Color-coded status based on release date
- **Responsive Design**: Adapts to different screen sizes

## Props

- `stream` - Stream data object containing id, title, coverImage, latestReleaseAt, and count
- `isList` - Boolean to toggle between list and grid view modes

## Status Colors

- **Red**: Behind schedule (past due)
- **Yellow**: Ahead by 3 days or less
- **Green**: Ahead by more than 3 days

## Usage

```vue
<StreamItem :stream="streamData" :is-list="false" />
```
</docs>

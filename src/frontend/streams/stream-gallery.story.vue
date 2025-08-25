<template>
  <Story title="Stream Gallery" group="streams">
    <Variant title="Default" :setup-app="miniSidebar">
      <StreamGallery
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :streams="streams"
        :stories="['John', 'Acts']"
      />
    </Variant>

    <Variant title="Empty" :setup-app="miniSidebar">
      <StreamGallery
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :streams="[]"
        :stories="['John', 'Acts']"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { StreamIndexItem } from '../../types';
import { sharedProps, miniSidebar } from '../test/mocks';
import StreamGallery from './stream-gallery.vue';

const streams: StreamIndexItem[] = [
  {
    id: 1,
    title: 'The Gospel of John',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
    latestReleaseAt: '2024-01-15T10:30:00Z',
    count: 24,
  },
  {
    id: 2,
    title: 'Acts of the Apostles',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756123316/Acts_ggpfgy.webp',
    latestReleaseAt: '2024-01-10T14:20:00Z',
    count: 18,
  },
  {
    id: 3,
    title: 'Romans Study',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756123453/alabaster-co-rlb3upCBLck-unsplash_emiapj.jpg',
    latestReleaseAt: '2024-01-05T09:15:00Z',
    count: 12,
  },
  {
    id: 4,
    title: 'Psalms Collection',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756123097/top5_psalms_ddl7c0.jpg',
    latestReleaseAt: '2024-01-01T16:45:00Z',
    count: 31,
  },
];
</script>

<docs lang="md">
# Stream Gallery

A component that displays a collection of streams in either grid or list view format.

## Features

- **Toggle View**: Switch between grid and list layouts using the header icon
- **Responsive Design**: Adapts to different screen sizes
- **Stream Items**: Each stream displays cover image, title, latest release date, and count
- **Interactive**: Click to toggle between view modes

## Props

- `streams` - Array of StreamIndexItem objects to display
- `meta` - CMS metadata (from SharedPageProps)
- `user` - User data (from SharedPageProps)
- `languages` - Available languages (from SharedPageProps)
- `language` - Current language (from SharedPageProps)
- `errors` - Error state (from SharedPageProps)

## Usage

```vue
<StreamGallery
  :streams="streams"
  :meta="meta"
  :user="user"
  :languages="languages"
  :language="language"
  :errors="errors"
/>
```

## StreamIndexItem Interface

```typescript
interface StreamIndexItem {
  id: number;
  title: string;
  coverImage: string;
  latestReleaseAt: string;
  count: number;
}
```

## Layout Modes

- **Grid View**: Displays streams in a responsive grid layout
- **List View**: Displays streams in a vertical list format
- **Toggle**: Use the icon in the header to switch between views
</docs>

<template>
  <Story title="Story Item" group="stories">
    <Variant title="Grid View">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <StoryItem :story="storyData" :is-list="false" />
      </div>
    </Variant>

    <Variant title="List View">
      <div class="space-y-4 p-6">
        <StoryItem :story="storyData" :is-list="true" />
      </div>
    </Variant>

    <Variant title="With Drafts">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <StoryItem :story="storyWithDrafts" :is-list="false" />
      </div>
    </Variant>

    <Variant title="Long Description">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <StoryItem :story="storyWithLongDescription" :is-list="false" />
      </div>
    </Variant>

    <Variant title="Bookmarked">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <StoryItem :story="storyData" :is-list="false" />
      </div>
      <template #controls>
        <div class="p-4 border-t">
          <p class="text-sm text-gray-600 mb-2">Toggle bookmark to see hover effect:</p>
          <button 
            @click="toggleBookmark" 
            class="btn btn-blue"
          >
            {{ isBookmarked ? 'Remove Bookmark' : 'Add Bookmark' }}
          </button>
        </div>
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import StoryItem from './story-item.vue';
import { useSharedStore } from '../../store';
import type { StoryHandler } from '../../shared/helpers';

const shared = useSharedStore();

const storyData = {
  id: 1,
  name: 'The Gospel of John',
  description: 'A powerful narrative of Jesus Christ as the Word made flesh, emphasizing his divine nature and the importance of belief.',
  coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  chapterLimit: 21,
  draftCount: 0,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const storyWithDrafts = {
  id: 2,
  name: 'The Acts of the Apostles',
  description: 'The story of the early church and the spread of the gospel from Jerusalem to Rome.',
  coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  chapterLimit: 28,
  draftCount: 5,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const storyWithLongDescription = {
  id: 3,
  name: 'The Book of Revelation',
  description: 'A prophetic vision of the end times, filled with symbolic imagery and messages to the seven churches. This book contains some of the most vivid and complex imagery in all of scripture, depicting the ultimate victory of good over evil and the establishment of God\'s eternal kingdom.',
  coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  chapterLimit: 22,
  draftCount: 3,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const bookmark = {
  label: storyData.name,
  link: `/en/story/${storyData.id}`,
};

const isBookmarked = computed(() => {
  return shared.bookmarks.some(
    (b) => b.label === bookmark.label && b.link === bookmark.link,
  );
});

const toggleBookmark = () => {
  if (isBookmarked.value) {
    shared.setBookmarks(shared.bookmarks.filter(b => b.label !== bookmark.label || b.link !== bookmark.link));
  } else {
    shared.setBookmarks([...shared.bookmarks, bookmark]);
  }
};
</script>

<docs lang="md">
# Story Item

A component for displaying story information in both grid and list view formats.

## Usage

```vue
<StoryItem :story="storyData" :is-list="false" />
```

## Props

- `story` - Story data object containing id, name, description, coverImage, chapterLimit, and draftCount
- `is-list` - Boolean to determine if the component should render in list view (true) or grid view (false)

## Features

- Responsive design that adapts to grid and list layouts
- Bookmark functionality with hover effects
- Chapter limit and draft count indicators
- Text truncation for long descriptions
- Cover image display
- Link to story detail page

## Variants

- **Grid View** - Default card layout for story display
- **List View** - Horizontal layout for compact story listing
- **With Drafts** - Shows draft count indicator
- **Long Description** - Demonstrates text truncation
- **Bookmarked** - Interactive bookmark functionality
</docs>

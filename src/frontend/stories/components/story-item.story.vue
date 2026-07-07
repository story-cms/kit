<template>
  <Story title="Story Item" group="stories">
    <Variant title="Grid View">
      <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        <StoryItem :story="storyData" :is-list="false" />
      </div>
    </Variant>

    <Variant title="List View">
      <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white p-6">
        <table class="w-full min-w-[720px] table-auto">
          <thead class="border-b border-gray-200 bg-gray-50">
            <tr>
              <th
                class="max-w-[400px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Story
              </th>
              <th
                class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Chapters
              </th>
              <th
                class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Drafts
              </th>
              <th
                class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Status
              </th>
              <th
                class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Updated
              </th>
              <th
                class="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <StoryItem :story="storyData" :is-list="true" />
          </tbody>
        </table>
      </div>
    </Variant>

    <Variant title="With Drafts">
      <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        <StoryItem :story="storyWithDrafts" :is-list="false" />
      </div>
    </Variant>

    <Variant title="Long Description">
      <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        <StoryItem :story="storyWithLongDescription" :is-list="false" />
      </div>
    </Variant>

    <Variant title="Without cover">
      <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        <StoryItem :story="storyWithoutCover" :is-list="false" />
      </div>
    </Variant>

    <Variant title="Bookmarked">
      <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        <StoryItem :story="storyData" :is-list="false" />
      </div>
      <template #controls>
        <div class="border-t p-4">
          <p class="mb-2 text-sm text-gray-600">Toggle bookmark to see hover effect:</p>
          <button class="btn btn-blue" @click="toggleBookmark">
            {{ shared.isBookmarked(bookmark) ? 'Remove Bookmark' : 'Add Bookmark' }}
          </button>
        </div>
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StoryItem from './story-item.vue';
import { useSharedStore } from '../../store';
import type { StoryIndexItem } from '../../../types';
const shared = useSharedStore();

const storyData: StoryIndexItem = {
  id: 1,
  name: 'The Gospel of John',
  description:
    'A powerful narrative of Jesus Christ as the Word made flesh, emphasizing his divine nature and the importance of belief.',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756403499/alabaster-co-rlb3upCBLck-unsplash_nfp13e.jpg',
  chapterLimit: 21,
  isPublished: true,
  liveCount: 21,
  draftCount: 0,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const storyWithDrafts = {
  id: 2,
  name: 'The Acts of the Apostles',
  description:
    'The story of the early church and the spread of the gospel from Jerusalem to Rome.',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756403499/alabaster-co-rlb3upCBLck-unsplash_nfp13e.jpg',
  chapterLimit: 28,
  isPublished: true,
  liveCount: 23,
  draftCount: 5,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const storyWithLongDescription = {
  id: 3,
  name: 'The Book of Revelation',
  description:
    "A prophetic vision of the end times, filled with symbolic imagery and messages to the seven churches. This book contains some of the most vivid and complex imagery in all of scripture, depicting the ultimate victory of good over evil and the establishment of God's eternal kingdom.",
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756403499/alabaster-co-rlb3upCBLck-unsplash_nfp13e.jpg',
  chapterLimit: 22,
  isPublished: false,
  liveCount: 19,
  draftCount: 3,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const storyWithoutCover: StoryIndexItem = {
  id: 4,
  name: 'Untitled Story',
  description: 'A story created without an uploaded cover image.',
  coverImage: '',
  chapterLimit: 10,
  isPublished: false,
  liveCount: 0,
  draftCount: 0,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const bookmark = {
  label: storyData.name,
  link: `/en/story/${storyData.id}`,
};

const toggleBookmark = () => {
  if (shared.isBookmarked(bookmark)) {
    shared.setBookmarks(
      shared.bookmarks.filter(
        (b) => b.label !== bookmark.label || b.link !== bookmark.link,
      ),
    );
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

- `story` - Story data object containing id, name, description, coverImage, chapterLimit, liveCount, draftCount, and isPublished
- `is-list` - Boolean to determine if the component should render in list view (true) or grid view (false)

## Features

- Responsive grid card and table row layouts matching the resource library pattern
- Bookmark in the card footer (grid) or actions column (list)
- Grid footer shows Live/Draft status plus conditional progress: `Published: 34 of 42` or `Drafts: 6`
- List view Chapters and Drafts columns show values only (`34 of 42`, `6`) since headers provide context
- Line-clamped descriptions in grid view
- Cover image with placeholder fallback, or BookOpen icon when no image is available
- Navigates to the story detail page on click

## Variants

- **Grid View** - Bordered card with image, title, description, status badge, and progress badge
- **List View** - Table row with Story, Chapters, Drafts, Status, Updated, and Actions columns
- **With Drafts** - Published story shows published progress, not draft count
- **Long Description** - Demonstrates line-clamp text truncation
- **Without cover** - Empty `coverImage` falls back to the default placeholder
- **Bookmarked** - Interactive bookmark functionality in the card footer
</docs>

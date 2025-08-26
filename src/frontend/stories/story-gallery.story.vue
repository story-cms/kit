<template>
  <Story title="Story Gallery" group="stories">
    <Variant title="Default" :setup-app="miniSidebar">
      <StoryGallery
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :stories="sampleStories"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
      />
    </Variant>

    <Variant title="Empty" :setup-app="miniSidebar">
      <StoryGallery
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :stories="[]"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
      />
    </Variant>

    <Variant title="Many Stories" :setup-app="miniSidebar">
      <StoryGallery
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :stories="manyStories"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StoryGallery from './story-gallery.vue';
import { sharedProps, miniSidebar } from '../test/mocks';
import type { StoryIndexItem } from '../../types';

const sampleStories: StoryIndexItem[] = [
  {
    id: 1,
    name: 'John',
    description:
      'The Gospel of John tells the story of Jesus Christ, the Son of God, and how He came to bring eternal life to all who believe.',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756123453/alabaster-co-rlb3upCBLck-unsplash_emiapj.jpg',
    chapterLimit: 42,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    draftCount: 5,
  },
  {
    id: 2,
    name: 'Acts',
    description:
      'The Acts of the Apostles chronicles the early church and the spread of the gospel from Jerusalem to the ends of the earth.',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756123316/Acts_ggpfgy.webp',
    chapterLimit: 28,
    createdAt: '2024-02-10T09:15:00Z',
    updatedAt: '2024-03-18T16:20:00Z',
    draftCount: 3,
  },
  {
    id: 3,
    name: 'Romans',
    description:
      "Paul's letter to the Romans presents the gospel of God's grace and the righteousness that comes through faith in Christ.",
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756122407/christ-chaos-header_yqrufy_lzmfjt.jpg',
    chapterLimit: 16,
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-03-15T13:30:00Z',
    draftCount: 2,
  },
];

const manyStories: StoryIndexItem[] = [
  ...sampleStories,
  {
    id: 4,
    name: 'Matthew',
    description:
      'The Gospel of Matthew presents Jesus as the promised Messiah and King of the Jews.',
    coverImage:
      'https://vhx.imgix.net/testymctester/assets/7d5ac750-ce3f-441c-b7ec-232fdf08c0f4-fe1e1849.jpg?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    chapterLimit: 28,
    createdAt: '2024-01-05T08:45:00Z',
    updatedAt: '2024-03-10T12:15:00Z',
    draftCount: 4,
  },
  {
    id: 5,
    name: 'Mark',
    description:
      'The Gospel of Mark portrays Jesus as a man of action, moving quickly from one event to the next.',
    coverImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ9SUjvKQHEi0YxampzrvJRrEatDXNpMfoDSb-jvaozDECxaeqFth7-pbiiptK-CL5dvw&usqp=CAU',
    chapterLimit: 16,
    createdAt: '2024-01-20T10:20:00Z',
    updatedAt: '2024-03-12T15:45:00Z',
    draftCount: 1,
  },
  {
    id: 6,
    name: 'Luke',
    description:
      "The Gospel of Luke provides a detailed account of Jesus' life and ministry, emphasizing His compassion.",
    coverImage:
      'https://media.versebyverseministry.org/images/bible_study_images/Luke_cover_centered.jpg',
    chapterLimit: 24,
    createdAt: '2024-02-05T14:30:00Z',
    updatedAt: '2024-03-14T11:20:00Z',
    draftCount: 6,
  },
  {
    id: 7,
    name: '1 Corinthians',
    description:
      'Paul addresses various issues in the Corinthian church, emphasizing unity and love.',
    coverImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScT9sh-ERus5isz8b9Y6hkVPPSmG8bUZmbCmGTlAgEQoE37X9Ty8_m-KsxkbszOev6hwU&usqp=CAU',
    chapterLimit: 16,
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2024-03-16T16:30:00Z',
    draftCount: 2,
  },
  {
    id: 8,
    name: 'Galatians',
    description:
      'Paul defends the gospel of grace and freedom in Christ against legalistic teaching.',
    coverImage:
      'https://ministry-to-youth.com/cdn/shop/products/Galatians-TitleSlide_720x.jpg?v=1601513454',
    chapterLimit: 6,
    createdAt: '2024-01-30T13:15:00Z',
    updatedAt: '2024-03-08T10:45:00Z',
    draftCount: 1,
  },
];
</script>

<docs lang="md">
# Story Gallery

The Story Gallery component displays a collection of stories in either grid or list view, with sorting and filtering capabilities.

## Features

- **Grid/List View Toggle**: Switch between grid and list layouts
- **Sorting**: Sort by creation date or last updated date
- **Add Story**: Quick access to create new stories
- **Responsive Design**: Adapts to different screen sizes
- **RTL Support**: Right-to-left language support

## Props

- `bookmarks` - Available bookmarks array
- `exclude` - Exclude nav bar elements
- `meta` - CMS metadata
- `user` - Current user information
- `languages` - Available languages
- `language` - Current language
- `errors` - Error state

## Usage

```vue
<StoryGallery
  :bookmarks="bookmarks"
  :exclude="[]"
  :meta="meta"
  :user="user"
  :languages="languages"
  :language="language"
  :errors="errors"
/>
```

## Interactions

- Click the list/grid toggle to switch view modes
- Use sort buttons to change the order of stories
- Click the plus button to create a new story
- Click on individual story items to view/edit them
</docs>

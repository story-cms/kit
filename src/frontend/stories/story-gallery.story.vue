<template>
  <Story title="Story Gallery" group="stories">
    <Variant title="Default" :setup-app="miniSidebar">
      <StoryGallery
        :config="configWithMultiStory"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :stories="sampleStories"
      />
    </Variant>

    <Variant title="Without multi-story" :setup-app="miniSidebar">
      <StoryGallery
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :stories="sampleStories"
      />
    </Variant>

    <Variant title="Translation locale" :setup-app="miniSidebar">
      <StoryGallery
        :config="configWithMultiStory"
        :user="sharedProps.user"
        :language="german"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :stories="sampleStories"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StoryGallery from './story-gallery.vue';
import { german, sharedProps, miniSidebar } from '../test/mocks';
import type { StoryIndexItem, Subscription, UiConfig } from '../../types';

const configWithMultiStory: UiConfig = {
  ...sharedProps.config,
  subscriptions: [...sharedProps.config.subscriptions, 'multi-story'] as Subscription[],
};

const sampleStories: StoryIndexItem[] = [
  {
    id: 1,
    name: 'John',
    description:
      'The Gospel of John tells the story of Jesus Christ, the Son of God, and how He came to bring eternal life to all who believe.',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756123453/alabaster-co-rlb3upCBLck-unsplash_emiapj.jpg',
    chapterLimit: 42,
    isPublished: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    liveCount: 37,
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
    isPublished: true,
    createdAt: '2024-02-10T09:15:00Z',
    updatedAt: '2024-03-18T16:20:00Z',
    liveCount: 25,
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
    isPublished: false,
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-03-15T13:30:00Z',
    liveCount: 14,
    draftCount: 2,
  },
];
</script>

<docs lang="md">
# Story Gallery

The Story Gallery component displays a collection of stories in either grid or list view, with sorting and filtering capabilities.

## Features

- **Grid/List View Toggle**: Switch between grid and list layouts
- **Sorting**: Sort by creation date or last updated date
- **Add Story**: Quick access to create new stories (requires `multi-story` subscription and the source locale)
- **Responsive Design**: Adapts to different screen sizes
- **RTL Support**: Right-to-left language support

## Props

- `bookmarks` - Available bookmarks array
- `exclude` - Exclude nav bar elements
- `config` - CMS config
- `user` - Current user information
- `language` - Current language
- `errors` - Error state

## Usage

```vue
<StoryGallery
  :bookmarks="bookmarks"
  :config="config"
  :user="user"
  :language="language"
  :errors="errors"
/>
```

## Interactions

- Click the list/grid toggle to switch view modes
- Use sort buttons to change the order of stories
- Click the plus button to create a new story (when `multi-story` is in `config.subscriptions` and you are on the source locale)
- On translation locales the plus button is hidden (see the **Translation locale** variant)
- Click on individual story items to view/edit them
</docs>

<template>
  <Story title="Bookmark Action" group="shared">
    <Variant title="Default" :setup-app="setupDefault">
      <BookmarkAction :bookmark="bookmark" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import BookmarkAction from './bookmark-action.vue';
import { useSharedStore } from '../store';
import type { StoryHandler } from './helpers';
import type { Bookmark } from '../../types';
import axios from 'axios';

const bookmark: Bookmark = {
  label: 'Sample Story',
  link: '/stories/sample-story',
};

// Mock axios for story environment
const mockAxiosPost = () => {
  axios.post = () => Promise.resolve({ data: 'mocked' }) as any;
};

const setupDefault: StoryHandler = (): void => {
  const shared = useSharedStore();
  // Initialize store state to prevent proxy errors
  shared.setBookmarks([]);
  mockAxiosPost();
};
</script>

<docs lang="md">
# Bookmark Action

A button component that allows users to toggle bookmark status for stories or chapters.

## Usage

```vue
<BookmarkAction :bookmark="bookmarkData" />
```

## Props

- `bookmark` - The bookmark object containing label, link, and optional icon

## Features

- Toggles bookmark status on click
- Updates shared store with bookmark changes
- Shows success/error messages
- Visual feedback with star icon
- Integrates with shared bookmark management

## Bookmark Object Structure

```typescript
interface Bookmark {
  label: string;
  link: string;
}
```

## Events

- Automatically updates the shared store's bookmark list
- Displays success/error messages via the shared store
- Toggles bookmark presence in the store

## Accessibility

- Uses semantic button element
- Provides visual feedback with star icon
- Integrates with screen readers through proper labeling
</docs>

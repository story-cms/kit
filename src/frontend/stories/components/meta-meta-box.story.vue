<template>
  <Story title="Meta Meta Box" group="stories">
    <Variant title="Default">
      <MetaMetaBox
        story-type="Gospel"
        chapter-type="Narrative"
        created-at="2024-01-15T10:30:00Z"
        updated-at="2024-01-20T14:45:00Z"
      />
    </Variant>

    <Variant title="Epistle">
      <MetaMetaBox
        story-type="Epistle"
        chapter-type="Teaching"
        created-at="2024-02-01T09:15:00Z"
        updated-at="2024-02-05T16:20:00Z"
      />
    </Variant>

    <Variant title="Historical">
      <MetaMetaBox
        story-type="Historical"
        chapter-type="Account"
        created-at="2024-03-10T11:00:00Z"
        updated-at="2024-03-12T13:30:00Z"
      />
    </Variant>

    <Variant title="Recent Updates">
      <MetaMetaBox
        story-type="Prophecy"
        chapter-type="Vision"
        created-at="2024-01-01T00:00:00Z"
        updated-at="2024-12-31T23:59:59Z"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import MetaMetaBox from './meta-meta-box.vue';
</script>

<docs lang="md">
# Meta Meta Box

A component that displays metadata information for stories and chapters in a structured format.

## Usage

```vue
<MetaMetaBox
  story-type="Gospel"
  chapter-type="Narrative"
  created-at="2024-01-15T10:30:00Z"
  updated-at="2024-01-20T14:45:00Z"
/>
```

## Props

- `storyType` - The type of story (e.g., Gospel, Epistle, Historical)
- `chapterType` - The type of chapter (e.g., Narrative, Teaching, Account)
- `createdAt` - ISO date string when the content was created
- `updatedAt` - ISO date string when the content was last updated

## Features

- Displays story and chapter type information
- Shows creation and last updated timestamps
- Automatically formats dates for display
- Uses the underlying MetaBox component for consistent styling
</docs>

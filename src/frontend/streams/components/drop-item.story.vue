<template>
  <Story title="Drop Item" group="streams">
    <Variant title="Card Layout">
      <div class="w-80">
        <DropItem
          :drop="dropData"
          :is-list="false"
          :placeholder-image="placeholderImage"
        />
      </div>
    </Variant>

    <Variant title="List Layout">
      <div class="w-full max-w-2xl">
        <DropItem
          :drop="dropData"
          :is-list="true"
          :placeholder-image="placeholderImage"
        />
      </div>
    </Variant>

    <Variant title="Without Release Date">
      <div class="w-80">
        <DropItem
          :drop="dropWithoutDate"
          :is-list="false"
          :placeholder-image="placeholderImage"
        />
      </div>
    </Variant>

    <Variant title="Without Cover Image">
      <div class="w-80">
        <DropItem
          :drop="dropWithoutImage"
          :is-list="false"
          :placeholder-image="placeholderImage"
        />
      </div>
    </Variant>

    <Variant title="Long Title">
      <div class="w-80">
        <DropItem
          :drop="dropWithLongTitle"
          :is-list="false"
          :placeholder-image="placeholderImage"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import DropItem from './drop-item.vue';
import type { DropIndexItem } from '../../../types';

const placeholderImage =
  'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg';

const dropData: DropIndexItem = {
  id: 1,
  title: 'Sample Drop',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756122407/christ-chaos-header_yqrufy_lzmfjt.jpg',
  releaseAt: '2024-03-15T10:00:00Z',
  isPublished: true,
};

const dropWithoutDate: DropIndexItem = {
  id: 2,
  title: 'Drop Without Date',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756122407/christ-chaos-header_yqrufy_lzmfjt.jpg',
  releaseAt: '',
  isPublished: true,
};

const dropWithoutImage: DropIndexItem = {
  id: 3,
  title: 'Drop Without Image',
  coverImage: '',
  releaseAt: '2024-04-20T15:00:00Z',
  isPublished: true,
};

const dropWithLongTitle: DropIndexItem = {
  id: 4,
  title:
    'This is a very long drop title that might wrap to multiple lines and test the component layout',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756122407/christ-chaos-header_yqrufy_lzmfjt.jpg',
  releaseAt: '2024-05-01T12:00:00Z',
  isPublished: true,
};
</script>

<docs lang="md">
# Drop Item

A component for displaying drop items in either card or list layout format.

## Usage

```vue
<DropItem :drop="dropData" :is-list="false" :placeholder-image="placeholderImage" />
```

## Props

- `drop` - The drop data object containing title, cover image, and release date
- `isList` - Boolean to toggle between card layout (false) and list layout (true)
- `placeholderImage` - Fallback image URL when drop has no cover image

## Features

- Responsive layout that adapts between card and list views
- Automatic date formatting with ordinal suffixes
- Fallback image support
- Clean typography and spacing
- Shadow and rounded corners for visual appeal

## Layouts

### Card Layout

- Vertical arrangement with image on top
- Title and date below the image
- Fixed width suitable for grid layouts

### List Layout

- Horizontal arrangement with image on the left
- Title and date on the right
- Flexible width for list containers
</docs>

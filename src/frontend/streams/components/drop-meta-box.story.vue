<template>
  <Story title="Drop Meta Box" group="streams">
    <Variant title="Default">
      <DropMetaBox
        :created-at="'2024-01-15T10:30:00Z'"
        :updated-at="'2024-01-20T14:45:00Z'"
        :updated-by="'John Doe'"
      />
    </Variant>

    <Variant title="Recent Update">
      <DropMetaBox
        :created-at="'2024-01-15T10:30:00Z'"
        :updated-at="'2024-01-21T09:15:00Z'"
        :updated-by="'Jane Smith'"
      />
    </Variant>

    <Variant title="Same Day">
      <DropMetaBox
        :created-at="'2024-01-21T08:00:00Z'"
        :updated-at="'2024-01-21T16:30:00Z'"
        :updated-by="'Admin User'"
      />
    </Variant>

    <Variant title="Long Username">
      <DropMetaBox
        :created-at="'2024-01-10T12:00:00Z'"
        :updated-at="'2024-01-19T18:20:00Z'"
        :updated-by="'Very Long Username That Might Overflow'"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import DropMetaBox from './drop-meta-box.vue';
</script>

<docs lang="md">
# Drop Meta Box

A component that displays metadata information for drops, including creation date, last update time, and who made the last update.

## Usage

```vue
<DropMetaBox
  :created-at="'2024-01-15T10:30:00Z'"
  :updated-at="'2024-01-20T14:45:00Z'"
  :updated-by="'John Doe'"
/>
```

## Props

- `createdAt` - The creation date of the drop (ISO string)
- `updatedAt` - The last update date of the drop (ISO string)
- `updatedBy` - The name of the user who made the last update

## Features

- Displays auto-save information with formatted date/time
- Shows creation date and last updated by information
- Uses consistent date formatting across the application
- Responsive design with proper spacing and typography
</docs>

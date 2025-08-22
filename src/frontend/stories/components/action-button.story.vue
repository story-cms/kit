<template>
  <Story title="Action Button" group="stories">
    <Variant title="Default">
      <ActionButton icon="star" @tap="handleTap" />
    </Variant>

    <Variant title="Different Icons">
      <div class="flex gap-4">
        <ActionButton icon="plus" @tap="handleTap" />
        <ActionButton icon="check" @tap="handleTap" />
        <ActionButton icon="info" @tap="handleTap" />
        <ActionButton icon="edit" @tap="handleTap" />
        <ActionButton icon="trash" @tap="handleTap" />
      </div>
    </Variant>

    <Variant title="With Click Handler">
      <ActionButton icon="plus" @tap="handleTap" />
      <div class="mt-4 text-sm text-gray-600">
        Click count: {{ clickCount }}
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ActionButton from './action-button.vue';

const clickCount = ref(0);

const handleTap = () => {
  clickCount.value++;
  console.log('Action button tapped!');
};
</script>

<docs lang="md">
# Action Button

A circular button component with an icon that emits a tap event when clicked.

## Usage

```vue
<ActionButton icon="plus" @tap="handleTap" />
```

## Props

- `icon` - The name of the icon to display (string, required)

## Events

- `tap` - Emitted when the button is clicked

## Features

- Circular design with hover effects
- Icon-based content
- Accessible button semantics
- Smooth transitions
- Responsive sizing

## Accessibility

- Uses semantic button element
- Includes proper cursor styling
- Supports keyboard navigation
- Maintains focus states
</docs>

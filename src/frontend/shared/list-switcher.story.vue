<template>
  <Story title="List Switcher" group="shared">
    <Variant title="List View">
      <ListSwitcher :is-list="true" @toggle="handleToggle" />
    </Variant>

    <Variant title="Grid View">
      <ListSwitcher :is-list="false" @toggle="handleToggle" />
    </Variant>

    <Variant title="Interactive Demo">
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Current view:</span>
          <span class="font-medium">{{ currentView }}</span>
        </div>
        <ListSwitcher :is-list="isListView" @toggle="toggleView" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ListSwitcher from './list-switcher.vue';

const isListView = ref(true);

const currentView = computed(() => {
  return isListView.value ? 'List' : 'Grid';
});

const handleToggle = () => {
  console.log('Toggle clicked');
};

const toggleView = () => {
  isListView.value = !isListView.value;
};
</script>

<docs lang="md">
# List Switcher

A toggle button component that switches between list and grid view modes.

## Usage

```vue
<ListSwitcher :is-list="true" @toggle="handleToggle" />
```

## Props

- `isList` (boolean, required) - Determines the current view mode and icon display

## Events

- `toggle` - Emitted when the toggle button is clicked

## Behavior

- Shows a grid icon when in list view (clicking will switch to grid)
- Shows a list icon when in grid view (clicking will switch to list)
- Emits a toggle event when clicked to allow parent component to handle state changes

## Accessibility

- Uses semantic button element for proper keyboard navigation
- Icon provides visual indication of current state and action
- Toggle event allows parent to update ARIA labels and descriptions as needed
</docs>

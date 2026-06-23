<template>
  <Story title="Story Edit Resources" group="resources">
    <Variant title="Default">
      <StoryEditResources
        v-model:resources="attachedResources"
        :available-resources="availableResources"
      />
    </Variant>

    <Variant title="Empty">
      <StoryEditResources
        v-model:resources="emptyResources"
        :available-resources="availableResources"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StoryEditResources from './story-edit-resources.vue';
import { availableResources, sampleAttachedResources } from '../../test/mocks';
import type { ResourceItem } from '../../../types';

const attachedResources = ref<ResourceItem[]>([...sampleAttachedResources]);
const emptyResources = ref<ResourceItem[]>([]);
</script>

<docs lang="md">
# Story Edit Resources

Resources tab for the story editor. Mirrors `ResourcesTab`: search the library,
attach resources, group by label, and drag to reorder labels and items.

Mock data lives in `src/frontend/test/mocks.ts`:

- `availableResources` — full searchable library passed as `available-resources`
- `sampleAttachedResources` — eight pre-attached items for the **Default** variant

## Usage

```vue
<StoryEditResources
  v-model:resources="attachedResources"
  :available-resources="availableResources"
  @create="openCreateResource"
/>
```
</docs>

<template>
  <Story title="Glass Header" group="shared">
    <Variant title="Default">
      <div class="bg-gray-100 p-6">
        <GlassHeader title="Glass Header" subtitle="This is a subtitle">
          <template #actions>
            <StudioButton label="Cancel" variant="outline" @click="emit('cancel')" />
            <StudioButton label="Request content update" @click="emit('submit')">
              <Plus class="size-6" />
            </StudioButton>
          </template>
          <template #controls>
            <p>Controls</p>
          </template>
        </GlassHeader>
      </div>
    </Variant>

    <Variant title="Custom title prop">
      <div class="bg-gray-100 p-6">
        <GlassHeader title="Content Library" />
      </div>
    </Variant>
    <Variant title="For settings pages">
      <div class="bg-gray-100 p-6">
        <GlassHeader title="Settings" subtitle="Add new languages">
          <template #actions>
            <StudioButton label="Request content update" @click="emit('submit')">
              <Plus class="size-6" />
            </StudioButton>
          </template>
          <template #controls>
            <Controls />
          </template>
        </GlassHeader>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import GlassHeader from './glass-header.vue';
import StudioButton from './studio-button.vue';
import { Plus } from '@lucide/vue';
import Controls from '../settings/languages/components/controls.vue';

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'submit'): void;
}>();
</script>

<docs lang="md">
# Glass Header

A simple shared header component.

## Usage

```vue
<GlassHeader title="Dashboard" />
```

## Props

- `title` - Header title text (string, required)
</docs>

<template>
  <Story title="Glass Header" group="shared">
    <Variant title="Default">
      <div class="bg-gray-100 p-6">
        <GlassHeader title="Glass Header" subtitle="This is a subtitle" />
      </div>
    </Variant>

    <Variant title="Custom title prop">
      <GlassHeader title="Content Library" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import GlassHeader from './glass-header.vue';
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

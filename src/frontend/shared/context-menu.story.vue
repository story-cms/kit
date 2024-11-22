<template>
  <Story title="Context Menu" group="shared">
    <Variant title="With options">
      <ContextMenu :options="options" anchor="Episode" />
    </Variant>
    <Variant title="Without options">
      <ContextMenu :options="noOptions" anchor="Book" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ContextMenu from './context-menu.vue';
const options = ['Add', 'Edit', 'Delete'];
const noOptions: string[] = [];
</script>

<docs lang="md">
# Number Field
</docs>

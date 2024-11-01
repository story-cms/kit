<template>
  <Story title="Add Item Button" group="shared">
    <Variant title="With Label">
      <AddItemButton label="Story" />
    </Variant>
    <Variant title="Without Label">
      <AddItemButton label="" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import AddItemButton from './add-item-button.vue';
</script>

<docs lang="md">
# Number Field
</docs>

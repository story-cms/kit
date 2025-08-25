<template>
  <Story id="status-tag" title="Status Tag" group="shared">
    <Variant title="With expected text">
      <StatusTag tag="New" />
    </Variant>
    <Variant title="With unexpected text">
      <StatusTag tag="Unexpected" />
    </Variant>
    <Variant title="Without text">
      <StatusTag tag="" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StatusTag from './status-tag.vue';
</script>

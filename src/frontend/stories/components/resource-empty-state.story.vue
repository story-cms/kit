<template>
  <Story title="Resource Empty State" group="resources">
    <Variant title="Default">
      <ResourceEmptyState @browse="onBrowse" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ResourceEmptyState from './resource-empty-state.vue';

const onBrowse = () => {
  alert('Browse resources');
};
</script>

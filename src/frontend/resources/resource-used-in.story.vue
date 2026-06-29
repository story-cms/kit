<template>
  <Story title="Resource Used In" group="resources" :layout="{ type: 'grid', width: 640 }">
    <Variant title="With stories">
      <ResourceUsedIn :stories="mockUsedInStories" locale="en" />
    </Variant>

    <Variant title="Empty">
      <ResourceUsedIn :stories="[]" locale="en" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ResourceUsedIn from './resource-used-in.vue';
import { mockUsedInStories } from '../test/mocks';
</script>

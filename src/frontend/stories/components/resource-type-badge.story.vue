<template>
  <Story title="Resource Type Badge" group="resources">
    <Variant title="Video">
      <ResourceTypeBadge type="video" />
    </Variant>
    <Variant title="Article">
      <ResourceTypeBadge type="text" />
    </Variant>
    <Variant title="PDF">
      <ResourceTypeBadge type="pdf" />
    </Variant>
    <Variant title="URL">
      <ResourceTypeBadge type="url" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ResourceTypeBadge from './resource-type-badge.vue';
</script>

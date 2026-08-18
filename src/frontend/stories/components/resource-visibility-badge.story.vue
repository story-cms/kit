<template>
  <Story
    title="Resource Visibility Badge"
    group="resources"
    :layout="{ type: 'grid', width: 420 }"
  >
    <Variant title="All visibility types">
      <div class="flex flex-wrap gap-2 bg-white p-8">
        <ResourceVisibilityBadge visibility="public" />
        <ResourceVisibilityBadge visibility="guests" />
        <ResourceVisibilityBadge visibility="leaders" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ResourceVisibilityBadge from './resource-visibility-badge.vue';
</script>

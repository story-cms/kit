<template>
  <Story title="Resource Thumbnail" group="resources">
    <Variant title="With image">
      <ResourceThumbnail :item="availableResources[0]" />
    </Variant>
    <Variant title="Video">
      <ResourceThumbnail :item="videoWithoutImage" />
    </Variant>
    <Variant title="Article">
      <ResourceThumbnail :item="availableResources[1]" />
    </Variant>
    <Variant title="PDF">
      <ResourceThumbnail :item="availableResources[2]" />
    </Variant>
    <Variant title="URL">
      <ResourceThumbnail :item="availableResources[3]" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ResourceThumbnail from './resource-thumbnail.vue';
import { availableResources } from '../../test/mocks';

const videoWithoutImage = {
  ...availableResources[4],
  imageUrl: undefined,
};
</script>

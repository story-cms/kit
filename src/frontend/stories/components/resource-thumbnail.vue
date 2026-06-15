<template>
  <img
    v-if="item.imageUrl"
    :src="item.imageUrl"
    :alt="item.title"
    class="size-12 shrink-0 rounded object-cover"
  />
  <div
    v-else
    class="flex size-12 shrink-0 items-center justify-center rounded bg-gray-100 text-gray-500"
  >
    <component :is="iconFor(item.resourceType)" class="size-4" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { ExternalLink, FolderOpen, Video } from '@lucide/vue';
import type { Component } from 'vue';
import type { Resource, ResourceFormat } from '../../../types';

defineProps<{
  item: Resource;
}>();

const iconFor = (type: ResourceFormat): Component => {
  switch (type) {
    case 'video':
      return Video;
    case 'url':
    case 'article':
      return ExternalLink;
    case 'pdf':
    default:
      return FolderOpen;
  }
};
</script>

<template>
  <img
    v-if="item.imageUrl"
    :src="item.imageUrl"
    :alt="item.title"
    draggable="false"
    class="size-12 shrink-0 rounded object-cover"
  />
  <div
    v-else
    class="flex size-12 shrink-0 items-center justify-center rounded bg-gray-100 text-gray-500"
  >
    <component :is="iconFor(item.type)" class="size-4" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { ExternalLink, FileText, Video } from '@lucide/vue';
import type { Component } from 'vue';
import type { ResourceItem, ResourceType } from '../../../types';

defineProps<{
  item: ResourceItem;
}>();

const iconFor = (type: ResourceType): Component => {
  switch (type) {
    case 'video':
      return Video;
    case 'url_link':
      return ExternalLink;
    case 'text':
    default:
      return FileText;
  }
};
</script>

<template>
  <Story id="video-meta" title="Video Meta" group="widgets">
    <Variant title="">
      <VideoMeta :metadata-rows="metadataRows" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import VideoMeta from './video-meta.vue';

const metadataRows = [
  { label: 'Title', value: 'My Video' },
  { label: 'Video ID', value: '1234567890' },
  { label: 'URL', value: 'https://www.youtube.com/watch?v=1234567890' },
];
</script>

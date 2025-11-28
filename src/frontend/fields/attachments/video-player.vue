<template>
  <div class="w-auto h-48">
    <iframe :src="`${source}?autoplay=false&loop=false&muted=false&preload=false&responsive=true`" style="height: 100%; width: 100%" loading="lazy" allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" allowfullscreen="true">
    </iframe>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  // https://vz-831b1d74-446.b-cdn.net/d4748f79-100a-4446-862f-10f09a59d4aa/playlist.m3u8
  url: string;
  library: string;
}>();

const source = computed(() => {
  const pieces = props.url.split('/');
  if (pieces.length < 4) {
    return '';
  }
  const videoId = pieces[3];
  // https://iframe.mediadelivery.net/play/408259/555db8c9-c6d5-4025-963b-952b4f0cc236
  return `https://iframe.mediadelivery.net/embed/${props.library}/${videoId}`;
});
</script>

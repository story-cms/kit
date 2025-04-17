<template>
  <Story id="video-progress" title="Video Progress" group="widgets">
    <Variant title="Halfway">
      <VideoProgress :field="spec" :bytes-uploaded="130" :bytes-total="200" />
    </Variant>
    <Variant title="Empty">
      <VideoProgress :field="spec" :bytes-uploaded="0" :bytes-total="200" />
    </Variant>
    <Variant title="Full">
      <VideoProgress :field="spec" :bytes-uploaded="200" :bytes-total="200" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import VideoProgress from './video-progress.vue';
const spec = {
  name: 'intro',
  label: 'Intro video',
  widget: 'video',
  collectionId: '3b08a34e-1f2d-4e80-8c36-7c315e7eb507',
};
</script>

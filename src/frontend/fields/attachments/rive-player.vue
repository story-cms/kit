<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Rive } from '@rive-app/canvas';

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});

const canvas = ref<InstanceType<typeof HTMLCanvasElement> | null>(null);

onMounted(() => {
  new Rive({
    canvas: canvas.value as HTMLCanvasElement,
    src: props.url,
    autoplay: true,
  });
});
</script>

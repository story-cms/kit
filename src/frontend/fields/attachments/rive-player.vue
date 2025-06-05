<template>
  <div class="self-start w-full h-48 max-h-96 max-w-96">
    <canvas ref="canvas" class="self-start w-full h-48 max-h-96 max-w-96"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Rive } from '@rive-app/canvas';
import { storeToRefs } from 'pinia';
import { useSharedStore } from '../../store';

const shared = useSharedStore();
const { showSourceColumn, isTranslation } = storeToRefs(shared);

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});

const canvas = ref<InstanceType<typeof HTMLCanvasElement> | null>(null);
let riveInstance: Rive;

onMounted(() => {
  riveInstance = new Rive({
    src: props.url,
    autoplay: true,
    canvas: canvas.value as HTMLCanvasElement,
  });

  riveInstance.play();
  riveInstance.resizeDrawingSurfaceToCanvas();
  riveInstance.resizeToCanvas();
});

watch([showSourceColumn, isTranslation], ([showSourceColumn, isTranslation]) => {
  if (showSourceColumn && isTranslation) {
    riveInstance.play();
    riveInstance.resizeDrawingSurfaceToCanvas();
    riveInstance.resizeToCanvas();
    riveInstance.startRendering();
  }
});

onUnmounted(() => {
  riveInstance.stopRendering();
});
</script>

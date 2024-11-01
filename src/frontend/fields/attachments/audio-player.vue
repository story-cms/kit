<template>
  <audio
    v-if="url != null"
    ref="audioElement"
    controls
    @loadedmetadata="onLoadedMetadata"
  >
    <source :src="url" type="audio/mpeg" />
  </audio>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';

defineProps({
  url: {
    type: null as unknown as PropType<string | null>,
    required: true,
  },
});

const audioElement = ref<HTMLAudioElement | null>(null);

const emit = defineEmits(['duration']);
const onLoadedMetadata = () => {
  if (audioElement.value) {
    emit('duration', audioElement.value.duration);
  }
};
</script>

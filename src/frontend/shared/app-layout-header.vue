<template>
  <header
    ref="header"
    class="sticky top-0 z-10 border-gray-50 bg-gray-50 transition-all duration-75"
  >
    <slot v-if="!shared.hasFeedback" name="header" />
    <MessageCentre
      v-else
      :response="shared.messageCentre.response"
      :message="shared.messageCentre.message"
      :description="shared.messageCentre.description"
    />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSharedStore } from '../store';
import MessageCentre from './message-centre.vue';

const shared = useSharedStore();
const header = ref<HTMLElement | null>(null);

defineExpose({ header });
</script>

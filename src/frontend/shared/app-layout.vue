<template>
  <div class="min-h-screen pb-20 bg-app_gray">
    <div>
      <HeaderBar />
      <slot></slot>
    </div>
    <MessageCentre
      class="fixed inset-x-0 top-0"
      :class="{ hidden: !shared.hasFeedback }"
      :response="shared.messageCentre.response"
      :message="shared.messageCentre.message"
    />
  </div>
</template>

<script setup lang="ts">
import MessageCentre from './message-centre.vue';
import HeaderBar from './header-bar.vue';

import { onMounted, onUnmounted } from 'vue';
import { useSharedStore } from '../store';
const shared = useSharedStore();

const resizeHook = () => {
  const fresh = document.documentElement.clientWidth;
  shared.setLargeScreen(fresh >= 1116);
};

onMounted(() => {
  window.addEventListener('resize', resizeHook);
  resizeHook();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHook);
});
</script>

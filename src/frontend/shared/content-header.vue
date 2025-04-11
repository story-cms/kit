<template>
  <div class="relative flex items-center justify-between py-10">
    <h3
      id="content-title"
      class="font-['Inter'] text-2xl font-semibold text-gray-800 [&>span]:text-gray-400"
      v-html="title"
    ></h3>

    <ContentActionBar
      :element-to-watch="'content-title'"
      @request-change="emit('request-change')"
      @publish="emit('publish')"
      @submit="emit('submit')"
    />
  </div>
</template>

<script setup lang="ts">
import ContentActionBar from './content-action-bar.vue';
defineProps<{
  title: string;
}>();

const emit = defineEmits(['request-change', 'publish', 'submit']);
</script>

<template>
  <button
    type="button"
    class="grid transition-all duration-200 ease-in-out bg-white rounded-full cursor-pointer size-10 place-content-center hover:bg-gray-100"
    @click.prevent="emit('info')"
  >
    <Icon name="info" class="text-gray-500 cursor-pointer size-6" />
  </button>
  <button
    v-if="shared.meta.hasAppPreview"
    type="button"
    class="grid transition-all duration-200 ease-in-out bg-white rounded-full cursor-pointer size-10 place-content-center hover:bg-gray-100"
    @click.prevent="emit('app-preview')"
  >
    <Icon name="mobile" class="text-gray-500 cursor-pointer size-6" />
  </button>
  <button
    type="button"
    class="grid transition-all duration-200 ease-in-out bg-white rounded-full cursor-pointer size-10 place-content-center hover:bg-gray-100"
    @click="emit('delete')"
  >
    <Icon
      name="trash"
      class="flex items-center justify-center text-gray-500 cursor-pointer size-6"
    />
  </button>
</template>

<script setup lang="ts">
import Icon from '../shared/icon.vue';
import { useSharedStore } from '../store';

const shared = useSharedStore();

const emit = defineEmits(['info', 'app-preview', 'delete']);
</script>

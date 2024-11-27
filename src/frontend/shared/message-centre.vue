<template>
  <div
    class="z-50 flex h-24 w-full items-center justify-center space-x-6 bg-white [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:space-x-6 [&>span]:text-sm/4 [&>span]:font-medium"
  >
    <span v-if="response === 0">
      <Icon
        class="inline-flex items-center w-auto h-6 text-red-500"
        :name="'exclamation'"
      />
      <span>{{ message }}</span>
    </span>
    <span v-if="response === 1">
      <Icon class="inline-flex items-center w-6 h-6 text-blue-500" :name="'check'" />
      <span>{{ message }}</span>
    </span>
    <span v-if="response === 2">
      <Icon
        class="inline-flex items-center w-6 h-6 text-green-500"
        :name="'badge-check'"
      />
      <span>{{ message }}</span>
    </span>
    <span v-if="response === 3">
      <Icon
        class="inline-flex items-center w-6 h-6 text-yellow-500"
        :name="'information-circle'"
      />
      <span>{{ message }}</span>
    </span>
  </div>
</template>
<script setup lang="ts">
import Icon from './icon.vue';
import type { ResponseStatus } from '../../types';

defineProps<{
  response: ResponseStatus;
  message: string;
}>();
</script>

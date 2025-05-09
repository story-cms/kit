<template>
  <div
    class="flex items-center justify-center"
    :style="{
      height: `${shared.headerHeight}px`,
    }"
  >
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div v-if="message" class="text-sm font-medium leading-4">
        <div v-if="response === 0" class="flex items-center w-full gap-x-6">
          <Icon
            class="inline-flex items-center w-auto h-6 text-red-500"
            :name="'exclamation'"
          />
          <p class="max-w-full">{{ message }}</p>
        </div>
        <div v-if="response === 1" class="flex items-center w-full gap-x-6">
          <Icon class="inline-flex items-center w-6 h-6 text-blue-500" :name="'check'" />
          <p class="max-w-full">{{ message }}</p>
        </div>
        <div v-if="response === 2" class="flex items-center w-full gap-x-6">
          <Icon
            class="inline-flex items-center w-6 h-6 text-green-500"
            :name="'badge-check'"
          />
          <p class="max-w-full">{{ message }}</p>
        </div>
        <div v-if="response === 3" class="flex items-center w-full gap-x-6">
          <Icon
            class="inline-flex items-center w-6 h-6 text-yellow-500"
            :name="'information-circle'"
          />
          <p class="max-w-full">{{ message }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import Icon from './icon.vue';
import type { ResponseStatus } from '../../types';
import { useSharedStore } from '../store';

const shared = useSharedStore();

defineProps<{
  response: ResponseStatus;
  message: string;
}>();
</script>

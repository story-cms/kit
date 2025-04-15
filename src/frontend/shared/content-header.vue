<template>
  <div class="relative flex items-center justify-between py-10">
    <h3
      id="content-title"
      class="font-['Inter'] text-2xl font-semibold text-gray-800 [&>span]:text-gray-400"
      v-html="title"
    ></h3>

    <MakeSticky :el-id="'content-title'">
      <div class="flex items-center space-x-6">
        <button
          type="button"
          class="grid h-[42px] w-[42px] cursor-pointer place-content-center rounded-full border border-gray-300 bg-white"
          @click.prevent="emit('info')"
        >
          <Icon name="info" class="h-auto w-6 cursor-pointer text-gray-500" />
        </button>
        <button
          v-if="shared.meta.hasAppPreview"
          type="button"
          class="grid h-[42px] w-[42px] cursor-pointer place-content-center rounded-full border border-gray-300 bg-white"
          @click.prevent="emit('app-preview')"
        >
          <Icon name="mobile" class="h-auto w-6 cursor-pointer text-gray-500" />
        </button>
        <button
          type="button"
          class="grid h-[42px] w-[42px] cursor-pointer place-content-center rounded-full border border-gray-300 bg-white"
          @click="emit('delete')"
        >
          <Icon
            name="trash"
            class="flex h-auto w-6 cursor-pointer items-center justify-center text-gray-500"
          />
        </button>
        <slot name="actions"></slot>
      </div>
    </MakeSticky>
  </div>
  <div class="w-full">
    <slot name="labels"></slot>
  </div>
</template>

<script setup lang="ts">
import Icon from './icon.vue';
import { useSharedStore } from '../store';
import MakeSticky from './make-sticky.vue';

defineProps<{
  title: string;
}>();

const emit = defineEmits([
  'delete',
  'info',
  'app-preview',
  'request-change',
  'publish',
  'submit',
]);

const shared = useSharedStore();
</script>

<template>
  <StickyHeader>
    <div class="container px-3 mx-auto">
      <div class="flex items-center justify-between py-6">
        <!-- eslint-disable vue/no-v-html -->
        <h3
          class="font-['Inter'] text-2xl font-semibold text-gray-800 [&>span]:text-gray-400"
          v-html="title"
        ></h3>
        <div class="flex items-center space-x-6">
          <button
            type="button"
            class="grid h-[42px] w-[42px] cursor-pointer place-content-center rounded-full border border-gray-300 bg-white"
            @click.prevent="emit('info')"
          >
            <Icon name="info" class="w-6 h-auto text-gray-500 cursor-pointer" />
          </button>
          <button
            v-if="shared.meta.hasAppPreview"
            type="button"
            class="grid h-[42px] w-[42px] cursor-pointer place-content-center rounded-full border border-gray-300 bg-white"
            @click.prevent="emit('app-preview')"
          >
            <Icon name="mobile" class="w-6 h-auto text-gray-500 cursor-pointer" />
          </button>
          <button
            type="button"
            class="grid h-[42px] w-[42px] cursor-pointer place-content-center rounded-full border border-gray-300 bg-white"
            @click="emit('delete')"
          >
            <Icon
              name="trash"
              class="flex items-center justify-center w-6 h-auto text-gray-500 cursor-pointer"
            />
          </button>
          <slot></slot>
        </div>
      </div>
      <div>
        <slot name="labels"></slot>
      </div>
    </div>
  </StickyHeader>
</template>

<script setup lang="ts">
import Icon from './icon.vue';
import StickyHeader from './sticky-header.vue';
import { useSharedStore } from '../store';

defineProps<{
  title: string;
}>();
const emit = defineEmits(['delete', 'info', 'app-preview']);

const shared = useSharedStore();
</script>

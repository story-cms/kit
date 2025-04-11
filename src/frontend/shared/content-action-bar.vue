<template>
  <MakeSticky :el-id="elementToWatch">
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
      <WorkflowButtons
        @publish="emit('publish')"
        @request-change="emit('request-change')"
        @submit="emit('submit')"
      />
    </div>
  </MakeSticky>
</template>
<script setup lang="ts">
import Icon from './icon.vue';
import { useSharedStore } from '../store';
import MakeSticky from './make-sticky.vue';
import WorkflowButtons from '../fields/workflow-buttons.vue';
const emit = defineEmits([
  'delete',
  'info',
  'app-preview',
  'request-change',
  'publish',
  'submit',
]);
defineProps<{
  elementToWatch: string | 'top';
}>();

const shared = useSharedStore();
</script>

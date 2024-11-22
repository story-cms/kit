<template>
  <div
    class="grid grid-cols-12"
    :draggable="page ? page.isPublished : false"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover="onDragOver"
    @dragenter="emit('dragEnter')"
    @dragleave="onDragLeave"
  >
    <div
      v-if="page ? page.isPublished : false"
      class="flex items-center justify-center col-span-1 cursor-move"
    >
      <Icon name="drag" class="w-auto h-5 text-gray-400" />
    </div>
    <div
      class="col-span-11 bg-white border rounded-sm drop-shadow-sm"
      :class="{
        'px-4 py-2': page ? page.isDivider : false,
        'px-7 py-4': page ? !page.isDivider : false,
        'col-span-12': page ? !page.isPublished : false,
      }"
    >
      <div
        v-if="page ? !page.isDivider : false"
        class="flex justify-between space-x-3 cursor-pointer"
        @click="emit('tap', page.id)"
      >
        <div class="flex items-center">
          <img :src="page.icon" class="w-6 h-6" />
          <div class="ml-5 text-lg leading-7">
            <p class="font-bold text-gray-800">{{ page.title }}</p>
            <p class="font-medium text-gray-500">{{ page.description }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-5">
          <span
            v-if="page.isPublished"
            class="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full"
          >
            {{ page.isPublished ? 'Live' : 'Draft' }}
          </span>
          <Icon v-if="isLink" name="link" class="w-5 h-5 text-gray-900" />
          <Icon v-else name="menu" class="w-5 h-5 text-gray-900" />
        </div>
      </div>
      <div v-else class="relative">
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
          <div class="w-[calc(100%_-_56px)] border-t-2 border-gray-400"></div>
        </div>
        <div class="relative flex items-center justify-end">
          <button
            type="button"
            class="flex items-center justify-center w-3 h-3 p-5 text-sm font-medium leading-5 bg-transparent border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="emit('removeDivider')"
          >
            <Icon name="trash" class="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import Icon from '../../shared/icon.vue';
import type { PageItem } from '../../../interfaces';

const props = defineProps({
  page: {
    type: Object as PropType<PageItem>,
    required: false,
    default: null,
  },
  isDivider: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['removeDivider', 'tap', 'dragStart', 'dragEnter']);

const page = computed(() => props.page);

const isLink = computed(() => {
  if (page.value.body === null) return false;
  return (
    page.value.body?.startsWith('http://') || page.value.body?.startsWith('https://')
  );
});

// const isPublished = computed(() => page.value.isPublished);

const onDragStart = (event: DragEvent) => {
  const target = event.target as Element;
  target.classList.add('bg-blue-200');
  emit('dragStart');
};

const onDragEnd = (event: DragEvent) => {
  const target = event.target as Element;
  target.classList.remove('bg-blue-200');
  target.classList.remove('border-2');
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  const target = event.target as Element;
  target.classList.add('border-2');
};

const onDragLeave = (event: DragEvent) => {
  const target = event.target as Element;
  target.classList.remove('bg-purple-300');
  target.classList.remove('border-2');
  target.classList.remove('bg-blue-200');
};
</script>

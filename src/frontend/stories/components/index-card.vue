<template>
  <button
    type="button"
    class="grid overflow-hidden rounded-lg bg-white shadow [grid-template-areas:'image'_'content']"
    :class="{
      'grid-cols-1 grid-rows-[186px_1fr]': showImage,
      'w-full grid-cols-2': isList,
    }"
    @click="emit('tap', item)"
  >
    <div v-if="showImage" class="overflow-hidden [grid-area:image]">
      <img
        class="h-[186px] w-full object-cover object-center"
        :src="imgUrl"
        :alt="title"
      />
    </div>
    <div
      class="p-6"
      :class="{
        '[grid-area:content]': !isList,
        'col-span-full grid grid-cols-[subgrid]': isList,
      }"
    >
      <div
        class="grid grid-rows-[min-content_min-content] place-content-start text-left"
        :class="{
          'mb-3': !isList,
        }"
      >
        <h4 class="mb-1 font-bold text-gray-900">
          {{ chapterName }} {{ chapterNumber }}
        </h4>
        <p class="text-gray-500" :class="{ 'text-sm': isList, 'text-xs': !isList }">
          {{ title }}
        </p>
      </div>
      <div
        v-if="tags.length > 0"
        :class="{
          'col-start-2 self-center justify-self-end': isList,
          'flex items-center space-x-4': !isList,
        }"
      >
        <StatusTag v-for="tag in tags" :key="tag" :tag="tag" />
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed } from 'vue';
import StatusTag from '../../shared/status-tag.vue';
import type { IndexReadyItem } from '../../../types';
import { padZero } from '../../shared/helpers';

const props = defineProps({
  item: {
    type: Object as PropType<IndexReadyItem>,
    required: true,
  },
  isList: {
    type: Boolean,
    required: true,
  },
  scope: {
    type: String,
    required: true,
  },
  placeholderImage: {
    type: String,
    default: '',
    required: false,
  },
  chapterName: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['tap']);

const imgUrl = computed(() => props.item.imageUrl || props.placeholderImage);

const title = computed(
  () => props.item.title || `${props.chapterName} ${props.item.number}`,
);

const showImage = computed((): boolean => {
  if (props.isList) {
    return false;
  }
  return !!(props.item.imageUrl || props.placeholderImage);
});

const chapterNumber = computed(() => padZero(props.item.number));

const tags = computed(() => {
  if (props.scope === 'Live') {
    if (props.item.tags.includes('Draft')) {
      return ['Changed'];
    }
  } else {
    if (props.item.tags.includes('Live')) {
      return ['Changes'];
    }
    return ['New'];
  }
  return [];
});
</script>

<template>
  <div class="rounded-lg border border-gray-100 font-['Inter']">
    <section
      class="grid grid-cols-1 px-4 py-2 text-xs font-semibold leading-4 text-gray-500 gap-y-2 bg-gray-50"
    >
      <div class="grid grid-cols-2">
        <p>{{ props.storyType }}</p>
        <span class="text-right place-self-end">{{ story }}</span>
      </div>
      <div class="grid grid-cols-2">
        <p>Chapter</p>
        <span class="text-right place-self-end">{{ props.chapterType }}</span>
      </div>
    </section>
    <section
      class="grid grid-cols-1 px-4 pt-2 pb-4 text-xs font-normal leading-4 text-gray-600 bg-white p gap-y-2"
    >
      <div class="grid grid-cols-2">
        <p>Created</p>
        <span class="text-right place-self-end">{{ formatDate(props.createdAt) }}</span>
      </div>
      <div class="grid grid-cols-2">
        <p>Auto-Saved</p>
        <span class="text-right place-self-end">{{ formatDate(props.updatedAt) }}</span>
      </div>
      <div class="grid grid-cols-2">
        <p>Last Published</p>
        <span class="text-right place-self-end">{{ publishedWhen }}</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from '../shared/icon.vue';
import type { ChapterMeta, Meta } from '../../types';
import { formatDate } from './helpers';
import { useDraftsStore } from '../store';

interface Props {
  storyType: Meta['storyType'];
  chapterType: Meta['chapterType'];
  createdAt: ChapterMeta['createdAt'];
  updatedAt: ChapterMeta['updatedAt'];
  publishedWhen: string;
  isFloating?: boolean;
  storyName?: string;
}

const props = defineProps<Props>();
const drafts = useDraftsStore();

const story = computed(() => props.storyName ?? drafts.story.name);

const emit = defineEmits(['close']);
</script>

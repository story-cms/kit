<template>
  <div class="rounded-lg border border-gray-100 font-['Inter']">
    <section
      class="grid grid-cols-1 p-4 text-xs font-normal leading-4 bg-gray-200 gap-y-2"
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
        <span class="text-right place-self-end">{{ publishedAtLabel }}</span>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { PageMeta } from '../../types';
import { formatDate } from '../shared/helpers';

const props = defineProps<
  Pick<PageMeta, 'createdAt' | 'updatedAt'> & {
    savedAt: string;
    publishedAt: string;
    isFloating?: boolean;
  }
>();

const emit = defineEmits(['close']);

const publishedAtLabel = computed(() => {
  if (props.publishedAt === 'unpublished') return 'UNPUBLISHED';
  return formatDate(props.publishedAt);
});
</script>

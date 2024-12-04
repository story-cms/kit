<template>
  <div
    class="relative max-w-[416px] bg-gray-200 p-8 font-['Inter'] text-lg/7 font-medium"
  >
    <button
      v-if="isFloating"
      type="button"
      class="absolute -right-2 -top-2 inline-flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white"
      @click.prevent="emit('close')"
    >
      <Icon name="cross" class="w-6 h-6" />
    </button>
    <section class="grid grid-cols-2">
      <p>Created</p>
      <span class="text-right">{{ formatDate(props.createdAt) }}</span>
    </section>
    <section class="grid grid-cols-2">
      <p>Auto-saved</p>
      <span class="text-right">{{ formatDate(props.savedAt) }}</span>
    </section>
    <section class="grid grid-cols-2">
      <p>Published</p>
      <span class="font-bold text-right">{{ publishedAtLabel }}</span>
    </section>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { PageMeta } from '../../../types';
import { formatDate } from '../../shared/helpers';
import Icon from '../../shared/icon.vue';

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

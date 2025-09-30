<template>
  <div
    class="group relative flex h-full overflow-hidden rounded-lg bg-white shadow"
    :class="isList ? 'flex-row items-center' : 'flex-col'"
  >
    <div
      class="absolute z-10 transition-opacity duration-300"
      :class="[
        isList ? 'right-2 top-2' : 'right-2 top-2',
        shared.isBookmarked(bookmark)
          ? 'opacity-100'
          : 'opacity-0 group-hover:opacity-100',
      ]"
    >
      <BookmarkAction :bookmark="bookmark" />
    </div>
    <img
      :src="stream.coverImage"
      :alt="stream.title"
      class="object-cover"
      :class="isList ? 'size-[60px]' : 'size-64'"
    />
    <div
      class="flex grow"
      :class="isList ? 'flex-row px-6' : 'flex-col justify-end space-y-2 px-3 py-4'"
    >
      <div
        class="flex"
        :class="
          isList ? 'w-full flex-row justify-between space-x-4' : 'flex-col space-y-2'
        "
      >
        <a
          :href="`/${shared.locale}/stream/${stream.id}`"
          class="text-base font-bold leading-6 text-gray-800 hover:cursor-pointer"
        >
          <span>{{ stream.title }}</span>
        </a>

        <div class="flex gap-x-2" :class="isList ? 'flex-row-reverse' : ''">
          <span
            class="flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium leading-4"
            :class="aheadColor.style"
            >{{ aheadColor.text }}: {{ formattedDate }}</span
          >
          <span
            class="flex size-[30px] items-center justify-center rounded-full bg-gray-100 p-2 text-xs font-medium leading-4 text-gray-800"
            >{{ stream.count }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { StreamIndexItem } from '../../../types';
import BookmarkAction from '../../shared/bookmark-action.vue';
import { useSharedStore } from '../../store';

const shared = useSharedStore();

const props = defineProps<{
  stream: StreamIndexItem;
  isList: boolean;
}>();

const formattedDate = computed(() => {
  const date = new Date(props.stream.latestReleaseAt || '');
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});

function daysAhead(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  const diff = (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return Math.round(diff);
}

const aheadColor = computed(() => {
  const days = daysAhead(props.stream.latestReleaseAt || '');
  if (days <= 0)
    return {
      style: 'bg-red-100 text-red-800',
      text: 'Behind',
    };
  if (days <= 3)
    return {
      style: 'bg-yellow-100 text-yellow-800',
      text: 'Ahead',
    };
  return {
    style: 'bg-green-100 text-green-800',
    text: 'Ahead',
  };
});

const bookmark = {
  label: props.stream.title,
  link: `/${shared.locale}/stream/${props.stream.id}`,
};
</script>

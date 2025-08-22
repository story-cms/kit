<template>
    <div
      class="overflow-hidden rounded-lg bg-white shadow flex h-full group relative"
      :class="isList ? 'flex-row items-center' : 'flex-col'"
    >
      <div
        class="absolute transition-opacity duration-300 z-10"
        :class="[
          isList ? 'top-2 right-2' : 'top-2 right-2',
          isBookmarked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
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
        :class="isList ? 'flex-row px-6' : 'flex-col justify-end  space-y-2 px-3 py-4'"
      >
        <div
          class="flex"
          :class="
            isList ? 'flex-row justify-between w-full space-x-4' : 'flex-col space-y-2'
          "
        >
          <a
            :href="`/${shared.locale}/stream/${stream.id}`"
            class="text-base leading-6 font-bold text-gray-800 hover:cursor-pointer"
          >
            <span>{{ stream.title }}</span>
          </a>
  
          <div class="flex gap-x-2" :class="isList ? 'flex-row-reverse' : ''">
            <span
              class="rounded-full text-xs leading-4 font-medium px-2 py-1 flex items-center justify-center"
              :class="aheadColor.style"
              >{{ aheadColor.text }}: {{ formattedDate }}</span
            >
            <span
              class="bg-gray-100 size-[30px] rounded-full text-xs leading-4 font-medium text-gray-800 p-2 flex items-center justify-center"
              >{{ stream.count }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { StreamIndexItem } from '../../../types';
  import { computed } from 'vue';
  import BookmarkAction from '../../shared/bookmark-action.vue';
  import { useSharedStore } from '@story-cms/kit/ui';
  
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
  
  const isBookmarked = computed(() => {
    return shared.bookmarks.some(
      (b) => b.label === bookmark.label && b.link === bookmark.link,
    );
  });
  </script>
  
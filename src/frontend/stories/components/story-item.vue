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
        :src="story.coverImage"
        :alt="story.name"
        class="object-cover"
        :class="isList ? 'size-[116px]' : 'size-64'"
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
            :href="`/${shared.locale}/story/${story.id}`"
            class="flex flex-col"
            :class="!isList ? 'space-y-2' : ''"
          >
            <p class="text-base leading-6 font-bold text-gray-800">
              <span>{{ story.name }}</span>
            </p>
            <p class="text-sm leading-5 font-medium text-gray-500">
              {{ truncateText(story.description) }}
            </p>
          </a>
          <div class="flex gap-2" :class="isList ? 'items-center' : ''">
            <div class="flex gap-x-2 text-xs leading-4 font-medium">
              <span
                class="bg-green-100 text-green-800 px-2 py-1 rounded-full size-[30px] flex items-center justify-center"
              >
                {{ story.chapterLimit }}
              </span>
              <span
                v-if="story.draftCount > 0"
                class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full size-[30px] flex items-center justify-center"
              >
                {{ story.draftCount }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { StoryIndexItem } from '../../../types';
  import { useSharedStore } from '@story-cms/kit/ui';
  import BookmarkAction from '../../shared/bookmark-action.vue';
  
  const shared = useSharedStore();
  
  const props = defineProps<{
    story: StoryIndexItem;
    isList: boolean;
  }>();
  
  const truncateText = (
    text: string,
    maxLength: number = 96,
    suffix: string = '...',
  ): string => {
    if (!text || text.length <= maxLength) {
      return text;
    }
  
    const truncatedLength = maxLength - suffix.length;
    return text.substring(0, truncatedLength) + suffix;
  };
  
  const bookmark = {
    label: props.story.name,
    link: `/${shared.locale}/story/${props.story.id}`,
  };
  
  const isBookmarked = computed(() => {
    return shared.bookmarks.some(
      (b) => b.label === bookmark.label && b.link === bookmark.link,
    );
  });
  </script>
  
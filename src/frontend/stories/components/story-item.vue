<template>
  <a
    :href="`/${shared.locale}/story/${story.id}`"
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
      :src="story.coverImage"
      :alt="story.name"
      class="object-cover"
      :class="{ 'size-[116px]': isList, 'size-64': !isList }"
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
          :href="`/${shared.locale}/story/${story.id}`"
          class="flex flex-col"
          :class="!isList ? 'space-y-2' : ''"
        >
          <p class="text-base font-bold leading-6 text-gray-800">
            <span>{{ story.name }}</span>
          </p>
          <p class="text-sm font-medium leading-5 text-gray-500">
            {{ truncateText(story.description) }}
          </p>
        </a>
        <div class="flex gap-2" :class="isList ? 'items-center' : ''">
          <div class="flex gap-x-2 text-xs font-medium leading-4">
            <span
              class="flex size-[30px] items-center justify-center rounded-full bg-green-100 px-2 py-1 text-green-800"
            >
              {{ story.chapterLimit }}
            </span>
            <span
              v-if="story.draftCount > 0"
              class="flex size-[30px] items-center justify-center rounded-full bg-yellow-100 px-2 py-1 text-yellow-800"
            >
              {{ story.draftCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { StoryIndexItem } from '../../../types';
import { useSharedStore } from '../../store';
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
</script>

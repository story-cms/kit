<template>
  <a
    :href="link"
    class="group relative flex h-full overflow-hidden rounded-lg bg-white shadow"
    :class="isList ? 'flex-row items-center' : 'flex-col'"
  >
    <div
      v-if="hasBookmark"
      class="absolute z-10 transition-opacity duration-300"
      :class="[
        isList ? 'right-2 top-2' : 'right-2 top-2',
        isBookmarked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
      ]"
    >
      <BookmarkAction :bookmark="bookmark" />
    </div>

    <img
      v-if="coverImage"
      :src="coverImage"
      alt="cover image"
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
        <div class="flex flex-col" :class="!isList ? 'space-y-2' : ''">
          <p class="text-base font-bold leading-6 text-gray-800">
            <span>{{ title }}</span>
          </p>
          <p v-if="subTitle" class="text-sm font-medium leading-5 text-gray-500">
            {{ subTitle }}
          </p>
        </div>

        <slot />
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BookmarkAction from './bookmark-action.vue';
import { Bookmark } from '../../types';
import { useSharedStore } from '../store';

const shared = useSharedStore();

const isBookmarked = computed<boolean>(() => {
  if (!props.hasBookmark) return false;
  return shared.isBookmarked(bookmark.value);
});

const bookmark = computed<Bookmark>(() => ({ label: props.title, link: props.link }));

const props = defineProps<{
  isList: boolean;
  link: string;
  title: string;
  subTitle?: string;
  coverImage?: string;
  hasBookmark?: boolean;
}>();
</script>

<template>
  <button @click="toggleBookmark">
    <Icon
      :name="isBookmarked ? 'star-filled' : 'star'"
      :class="isBookmarked ? 'text-yellow-500' : 'text-black'"
    />
  </button>
</template>
<script setup lang="ts">
import axios from 'axios';
import { computed } from 'vue';
import Icon from './icon.vue';
import { useSharedStore } from '../store';
import { type Bookmark } from '../../types';
import { ResponseStatus } from '../../types';

const shared = useSharedStore();

const props = defineProps<{
  bookmark: Bookmark;
}>();

// if isBookmarked, then show star-filled, otherwise show star
const isBookmarked = computed(() => {
  return shared.bookmarks.some(
    (b) => b.label === props.bookmark.label && b.link === props.bookmark.link,
  );
});

const toggleBookmark = async () => {
  try {
    await axios.post(`/preferences/bookmarks`, props.bookmark);
    shared.addMessage(ResponseStatus.Accomplishment, 'Bookmark updated successfully');

    const isBookmarked = shared.bookmarks.some(
      (b) => b.label === props.bookmark.label && b.link === props.bookmark.link,
    );

    if (isBookmarked) {
      const updatedBookmarks = shared.bookmarks.filter(
        (b) => !(b.label === props.bookmark.label && b.link === props.bookmark.link),
      );
      shared.setBookmarks(updatedBookmarks);
    } else {
      const updatedBookmarks = [...shared.bookmarks, props.bookmark];
      shared.setBookmarks(updatedBookmarks);
    }
  } catch {
    shared.addMessage(ResponseStatus.Failure, 'Error bookmarking story');
  }
};
</script>

<template>
  <button
    type="button"
    class="rounded-xl p-1.5 transition-colors"
    :class="
      shared.isBookmarked(props.bookmark)
        ? 'text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600'
        : 'text-gray-400 hover:bg-yellow-50 hover:text-yellow-600'
    "
    @click.prevent.stop="toggleBookmark"
  >
    <Star
      class="size-6 shrink-0"
      :class="shared.isBookmarked(props.bookmark) ? 'fill-current' : ''"
      aria-hidden="true"
    />
  </button>
</template>
<script setup lang="ts">
import axios from 'axios';
import { Star } from '@lucide/vue';
import { useSharedStore } from '../store';
import { type Bookmark } from '../../types';
import { ResponseStatus } from '../../types';

const shared = useSharedStore();

const props = defineProps<{
  bookmark: Bookmark;
}>();

const toggleBookmark = async () => {
  try {
    await axios.post(`/preferences/bookmarks`, props.bookmark);
    shared.addMessage(ResponseStatus.Accomplishment, 'Bookmark updated successfully');

    if (shared.isBookmarked(props.bookmark)) {
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

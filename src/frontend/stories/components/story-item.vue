<template>
  <div
    v-if="!isList"
    class="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
  >
    <button
      type="button"
      class="group/edit flex min-h-0 flex-1 flex-col text-left"
      @click="openStory"
    >
      <div v-if="hasThumbnail" class="h-48 overflow-hidden bg-gray-100">
        <img
          :src="imgUrl"
          :alt="story.name"
          class="size-full object-cover transition duration-300 group-hover/edit:scale-105 group-hover/edit:opacity-90"
        />
      </div>
      <div
        v-else
        class="flex h-48 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
      >
        <BookOpen
          class="size-8 text-gray-400 transition-opacity group-hover/edit:opacity-70"
          aria-hidden="true"
        />
      </div>

      <div class="min-h-0 flex-1 px-5 pt-5">
        <h3
          class="mb-2 line-clamp-2 text-base font-semibold text-gray-900 transition-opacity group-hover/edit:opacity-70"
        >
          {{ story.name }}
        </h3>

        <p
          v-if="story.description"
          class="line-clamp-2 min-h-10 text-sm leading-5 text-gray-500 transition-opacity group-hover/edit:opacity-70"
        >
          {{ story.description }}
        </p>
        <div v-else class="min-h-10" aria-hidden="true" />
      </div>
    </button>

    <div class="mt-2 px-5 pb-5">
      <div
        class="flex min-w-0 items-center justify-between gap-3 border-t border-gray-100 pt-3"
      >
        <div class="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <span
            class="inline-flex shrink-0 rounded-xl px-2 py-0.5 text-xs font-medium"
            :class="statusBadgeClasses"
          >
            {{ statusLabel }}
          </span>
          <span
            class="inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
            :class="progressBadgeClasses"
          >
            {{ progressLabel }}
          </span>
        </div>

        <div class="shrink-0 transition-opacity duration-300">
          <BookmarkAction :bookmark="bookmark" />
        </div>
      </div>
    </div>
  </div>

  <tr v-else class="transition-colors hover:bg-gray-50">
    <td class="max-w-[400px] px-6 py-4">
      <div class="group/edit flex min-w-0 items-center gap-3">
        <button
          type="button"
          class="shrink-0 rounded-xl transition-opacity group-hover/edit:opacity-70"
          @click="openStory"
        >
          <img
            v-if="hasThumbnail"
            :src="imgUrl"
            :alt="story.name"
            draggable="false"
            class="size-12 shrink-0 rounded-xl object-cover"
          />
          <div
            v-else
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500"
          >
            <BookOpen class="size-4" aria-hidden="true" />
          </div>
        </button>
        <div class="min-w-0 flex-1">
          <button
            type="button"
            class="block w-full truncate text-left text-sm font-medium text-gray-900 transition-opacity group-hover/edit:opacity-70"
            @click="openStory"
          >
            {{ story.name }}
          </button>
          <button
            v-if="story.description"
            type="button"
            class="block w-full truncate text-left text-xs text-gray-500 transition-opacity group-hover/edit:opacity-70"
            @click="openStory"
          >
            {{ story.description }}
          </button>
        </div>
      </div>
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
      {{ story.isPublished ? publishedCountLabel : '—' }}
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
      {{ story.draftCount > 0 ? story.draftCount : '—' }}
    </td>
    <td class="whitespace-nowrap px-6 py-4">
      <span class="rounded-xl px-2 py-1 text-xs font-medium" :class="statusBadgeClasses">
        {{ statusLabel }}
      </span>
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
      {{ formatListDate(story.updatedAt) }}
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-right">
      <div class="flex items-center justify-end gap-2">
        <BookmarkAction :bookmark="bookmark" />
        <button
          type="button"
          class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          aria-label="Edit story"
          @click="editStory"
        >
          <SquarePen class="size-4" aria-hidden="true" />
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { router } from '@inertiajs/vue3';
import { BookOpen, SquarePen } from '@lucide/vue';
import { DateTime } from 'luxon';
import { StoryIndexItem } from '../../../types';
import { useSharedStore } from '../../store';
import BookmarkAction from '../../shared/bookmark-action.vue';

const shared = useSharedStore();

const props = withDefaults(
  defineProps<{
    story: StoryIndexItem;
    isList: boolean;
    placeholderImage?: string;
  }>(),
  {
    placeholderImage:
      'https://res.cloudinary.com/redeem/image/upload/v1752849347/story-cms-ui/placeholder_bafmfz.jpg',
  },
);

const imgUrl = computed(() => props.story.coverImage || props.placeholderImage);

const hasThumbnail = computed(() => !!(props.story.coverImage || props.placeholderImage));

const storyUrl = computed(() => `/${shared.locale}/story/${props.story.id}`);

const bookmark = computed(() => ({
  label: props.story.name,
  link: storyUrl.value,
}));

const publishedLabel = computed(
  () => `Published: ${props.story.liveCount} of ${props.story.chapterLimit}`,
);

const publishedCountLabel = computed(
  () => `${props.story.liveCount} of ${props.story.chapterLimit}`,
);

const draftsLabel = computed(() => `Drafts: ${props.story.draftCount}`);

const progressLabel = computed(() =>
  props.story.isPublished ? publishedLabel.value : draftsLabel.value,
);

const progressBadgeClasses = computed(() =>
  props.story.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
);

const statusLabel = computed(() => (props.story.isPublished ? 'Live' : 'Draft'));

const statusBadgeClasses = computed(() =>
  props.story.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700',
);

const openStory = () => {
  router.visit(storyUrl.value);
};

const editStory = () => {
  router.visit(`/${shared.locale}/story/${props.story.id}/edit`);
};

const formatListDate = (value: string): string => {
  const parsed = DateTime.fromISO(value);
  return parsed.isValid ? parsed.toFormat('dd/MM/yyyy') : value;
};
</script>

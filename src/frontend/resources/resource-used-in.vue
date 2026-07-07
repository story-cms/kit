<template>
  <section class="rounded-xl border border-gray-200 bg-white p-8">
    <div class="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 class="text-base font-semibold text-gray-900">Used In</h2>
        <p class="mt-0.5 text-sm text-gray-500">
          Where this resource appears in your content
        </p>
      </div>
      <span v-if="stories.length > 0" class="shrink-0 text-xs text-gray-500">
        {{ attachmentLabel }}
      </span>
    </div>

    <div v-if="stories.length > 0" class="space-y-2">
      <a
        v-for="story in stories"
        :key="story.storyId"
        :href="storyHref(story.storyId)"
        class="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
      >
        <span
          class="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-violet-100 bg-violet-50 px-2 py-1 text-xs font-medium text-violet-600"
        >
          <BookOpen class="size-4" aria-hidden="true" />
          Story
        </span>
        <p class="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">
          {{ story.title }}
        </p>
      </a>
    </div>

    <p v-else class="text-sm text-gray-500">Not attached to any stories yet</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BookOpen } from '@lucide/vue';
import type { ResourceStoryUsage } from '../../types';

const props = defineProps<{
  stories: ResourceStoryUsage[];
  locale: string;
}>();

const attachmentLabel = computed(() => {
  const count = props.stories.length;
  const noun = count === 1 ? 'Story' : 'Stories';
  return `Linked to ${count} ${noun}`;
});

const storyHref = (storyId: number) =>
  `/${props.locale}/story/${storyId}/edit?tab=Resources`;
</script>

<template>
  <section class="rounded-[14px] border border-gray-200 bg-white p-8">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h2 class="text-base font-semibold text-gray-900">Used In</h2>
        <p class="mt-1 text-sm text-gray-500">
          Where this resource appears in your content
        </p>
      </div>
      <div class="flex shrink-0 flex-wrap items-center justify-end gap-2">
        <span class="text-xs text-gray-500">{{ attachmentLabel }}</span>
        <span
          class="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"
        >
          <BookOpen class="size-3.5" aria-hidden="true" />
          On Stories
        </span>
      </div>
    </div>

    <div v-if="stories.length > 0" class="mt-6 space-y-3">
      <a
        v-for="story in stories"
        :key="story.storyId"
        :href="storyHref(story.storyId)"
        class="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
      >
        <span
          class="inline-flex shrink-0 items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium text-violet-700 bg-violet-100"
        >
          <BookOpen class="size-3.5" aria-hidden="true" />
          Story
        </span>
        <span class="min-w-0 truncate text-sm font-semibold text-gray-900">
          {{ story.title }}
        </span>
      </a>
    </div>

    <p v-else class="mt-6 text-sm text-gray-500">Not attached to any stories yet</p>
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
  const noun = count === 1 ? 'attachment' : 'attachments';
  return `${count} explicit ${noun}`;
});

const storyHref = (storyId: number) =>
  `/${props.locale}/story/${storyId}/edit?tab=Resources`;
</script>

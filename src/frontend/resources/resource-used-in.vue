<template>
  <section class="rounded-xl border border-gray-200 bg-white p-8">
    <div class="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 class="text-base font-semibold text-gray-900">Used In</h2>
        <p v-if="stories.length > 0" class="mt-0.5 text-sm text-gray-500">
          {{ attachmentDescription }}
        </p>
      </div>
    </div>

    <div v-if="stories.length > 0" class="space-y-2">
      <a
        v-for="story in stories"
        :key="story.id"
        :href="storyHref(story.id)"
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

    <div v-else class="text-sm text-gray-500">
      <p>This resource is not attached to any content items yet.</p>
      <p>
        To attach it, open a content item, then go to
        <strong class="font-bold">Edit → Resources</strong> to add it.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BookOpen } from '@lucide/vue';
import type { ResourceUsage } from '../../types';

const props = defineProps<{
  stories: ResourceUsage[];
  locale: string;
}>();

const attachmentDescription = computed(() => {
  const count = props.stories.length;
  const noun = count === 1 ? 'content item' : 'content items';
  return `This resource is attached to ${count} ${noun}`;
});

const storyHref = (storyId: number) =>
  `/${props.locale}/story/${storyId}/edit?tab=Resources`;
</script>

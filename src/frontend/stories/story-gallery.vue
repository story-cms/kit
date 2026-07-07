<template>
  <AppLayout title="Stories">
    <template #actions>
      <div class="flex items-center justify-center gap-x-6">
        <ListSwitcher :is-list="isList" @toggle="isList = !isList" />

        <StudioButton
          v-if="canAddStories"
          label="Add story"
          variant="secondary"
          @click="addStory"
        >
          <Plus class="size-4" aria-hidden="true" />
        </StudioButton>
      </div>
    </template>
    <template #controls>
      <nav aria-label="Sort stories">
        <div class="flex flex-wrap gap-1">
          <TabButton
            label="Edited Date"
            :is-active="sortField === 'updatedAt'"
            @click="toggleSort('updatedAt')"
          >
            <ArrowDownWideNarrow
              v-if="sortField === 'updatedAt' && sortDescending"
              class="size-4"
              aria-hidden="true"
            />
            <ArrowUpWideNarrow v-else class="size-4" aria-hidden="true" />
          </TabButton>
          <TabButton
            label="Created Date"
            :is-active="sortField === 'createdAt'"
            @click="toggleSort('createdAt')"
          >
            <ArrowDownWideNarrow
              v-if="sortField === 'createdAt' && sortDescending"
              class="size-4"
              aria-hidden="true"
            />
            <ArrowUpWideNarrow v-else class="size-4" aria-hidden="true" />
          </TabButton>
        </div>
      </nav>
    </template>
    <template #main>
      <section class="px-3">
        <div
          v-if="sortedStories.length > 0 && !isList"
          class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <StoryItem
            v-for="story in sortedStories"
            :key="story.id"
            class="h-full"
            :story="story"
            :is-list="false"
          />
        </div>

        <div
          v-else-if="sortedStories.length > 0 && isList"
          class="overflow-x-auto rounded-xl border border-gray-200 bg-white"
        >
          <table class="w-full min-w-[720px] table-auto">
            <thead class="border-b border-gray-200 bg-gray-50">
              <tr>
                <th
                  class="max-w-[400px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Story
                </th>
                <th
                  class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Chapters
                </th>
                <th
                  class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Drafts
                </th>
                <th
                  class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Status
                </th>
                <th
                  class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Updated
                </th>
                <th
                  class="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Bookmarked
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <StoryItem
                v-for="story in sortedStories"
                :key="story.id"
                :story="story"
                :is-list="true"
              />
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { SharedPageProps, StoryGalleryProps } from '../../types';
import { useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import TabButton from '../shared/tab-button.vue';
import StudioButton from '../shared/studio-button.vue';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Plus } from '@lucide/vue';
import ListSwitcher from '../shared/list-switcher.vue';
import StoryItem from './components/story-item.vue';
import { router } from '@inertiajs/vue3';

const props = defineProps<StoryGalleryProps & SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);

const isList = ref(false);

const sortField = ref<'createdAt' | 'updatedAt'>('updatedAt');
const sortDescending = ref(true);

const toggleSort = (field: 'createdAt' | 'updatedAt') => {
  if (sortField.value === field) {
    sortDescending.value = !sortDescending.value;
  } else {
    sortField.value = field;
    sortDescending.value = true;
  }
};

const sortedStories = computed(() => {
  return [...props.stories].sort((a, b) => {
    const dateA = new Date(a[sortField.value]);
    const dateB = new Date(b[sortField.value]);

    if (sortDescending.value) {
      return dateB.getTime() - dateA.getTime(); // Descending (newest first)
    } else {
      return dateA.getTime() - dateB.getTime(); // Ascending (oldest first)
    }
  });
});

const sourceLocale = computed(() => shared.config.languages[0]?.locale ?? shared.locale);

const canAddStories = computed(
  () =>
    shared.config.subscriptions.includes('multi-story') &&
    shared.locale === sourceLocale.value,
);

const addStory = () => {
  router.get(`/${shared.locale}/story/create`);
};
</script>

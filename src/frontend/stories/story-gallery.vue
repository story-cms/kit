<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Stories">
        <template #actions>
          <div class="flex items-center justify-center gap-x-6">
            <ListSwitcher :is-list="isList" @toggle="isList = !isList" />
          </div>
        </template>
        <template #extra-actions>
          <div class="flex items-center gap-x-4">
            <ToggleButton
              icon-on="sort"
              icon-off="sort-asc"
              label="Edited Date"
              :is-on="sortField === 'updatedAt' && sortDescending"
              :is-active="sortField === 'updatedAt'"
              @toggle="toggleSort('updatedAt')"
            />
            <ToggleButton
              icon-on="sort"
              icon-off="sort-asc"
              label="Created Date"
              :is-on="sortField === 'createdAt' && sortDescending"
              :is-active="sortField === 'createdAt'"
              @toggle="toggleSort('createdAt')"
            />
          </div>
        </template>
      </ContentHeader>
    </template>

    <section>
      <div
        class="my-8 flex gap-x-[26px]"
        :class="isList ? 'flex-col gap-y-6' : 'flex-wrap gap-y-[98px]'"
      >
        <div
          v-for="story in sortedStories"
          :key="story.id"
          :class="isList ? 'w-full' : 'max-w-64'"
        >
          <StoryItem :story="story" :is-list="isList" />
        </div>
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { SharedPageProps, StoryGalleryProps } from '../../types';
import { useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import ToggleButton from '../shared/toggle-button.vue';
import ListSwitcher from '../shared/list-switcher.vue';
import StoryItem from './components/story-item.vue';

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

// hidden for now
// <IconButton icon="plus" @tap="addStory" />
// const addStory = () => {
//   router.get(`/${shared.locale}/story/create`);
// };
</script>

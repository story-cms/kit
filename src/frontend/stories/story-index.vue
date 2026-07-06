<template>
  <AppLayout :title="story.storyType" :subtitle="story.name">
    <template #actions>
      <StudioButton
        v-if="canEditStory"
        label="Edit"
        variant="outline"
        @click="editMeta"
      />
    </template>
    <template #controls>
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div class="flex flex-wrap items-center gap-3">
          <GlassButton
            label="Live"
            :count="liveCount"
            :active="currentTab === 'Live'"
            @click="onFilter('Live')"
          />
          <GlassButton
            label="Draft"
            :count="draftCount"
            :active="currentTab === 'Draft'"
            @click="onFilter('Draft')"
          />

          <StudioButton
            v-if="addStatus == AddStatus.Add"
            :label="story.chapterType"
            variant="outline"
            @click="addDraft"
          >
            <Plus class="size-4" aria-hidden="true" />
          </StudioButton>
          <button
            v-if="addStatus == AddStatus.Wait"
            type="button"
            class="font-dmsans inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-500"
            disabled
          >
            {{ `No more ${story.chapterType}s available to translate` }}
          </button>
        </div>

        <div ref="searchContainer" class="flex items-center gap-3">
          <div v-if="showSearch" class="relative">
            <input
              id="search"
              ref="searchInput"
              v-model="filterNumber"
              type="text"
              name="search"
              class="block w-48 rounded-xl bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              :placeholder="story.chapterType"
              @keydown.escape="closeSearch"
            />
            <Search
              class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <button
            type="button"
            class="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            :class="{ 'bg-gray-100 text-gray-900': showSearch }"
            aria-label="Search"
            :aria-expanded="showSearch"
            @click="toggleSearch"
          >
            <Search class="size-4" aria-hidden="true" />
          </button>
          <ListSwitcher :is-list="isList" @toggle="isList = !isList" />
        </div>
      </div>
    </template>
    <template #main>
      <div
        :class="[
          'grid gap-4',
          {
            'grid-cols-[repeat(auto-fit,_minmax(260px,_260px))]': !isList,
          },
          {
            'grid-cols-1': isList,
          },
        ]"
      >
        <index-card
          v-for="item in filteredIndex"
          :key="item.number"
          :item="item"
          :is-list="isList"
          placeholder-image="https://res.cloudinary.com/redeem/image/upload/v1752849347/story-cms-ui/placeholder_bafmfz.jpg"
          :scope="currentTab"
          :chapter-name="story.chapterType"
          @tap="onTap"
        />
      </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { Plus, Search } from '@lucide/vue';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';

import { IndexReadyItem, SharedPageProps, StoryIndexProps, AddStatus } from '../../types';
import AppLayout from '../shared/app-layout.vue';
import GlassButton from '../shared/glass-button.vue';
import ListSwitcher from '../shared/list-switcher.vue';
import StudioButton from '../shared/studio-button.vue';
import { useSharedStore } from '../store';
import IndexCard from './components/index-card.vue';

const props = defineProps<StoryIndexProps & SharedPageProps>();

const shared = useSharedStore();

shared.setFromProps(props);
shared.setCurrentStoryName(props.story.name);

const isList = ref(false);
const showSearch = ref(false);
const filterNumber = ref<string | null>(null);
const currentTab = ref('Live');
const searchInput = ref<HTMLInputElement | null>(null);
const searchContainer = ref<HTMLElement | null>(null);

const liveCount = computed(
  () => props.index.filter((item) => item.tags.includes('Live')).length,
);

const draftCount = computed(
  () => props.index.filter((item) => item.tags.includes('Draft')).length,
);

const addDraft = () =>
  router.get(`/${shared.locale}/story/${props.story.id}/draft/create`);

const onFilter = (tab: string) => {
  currentTab.value = tab;
};

const filteredIndex = computed(() => {
  const needle = currentTab.value === 'Live' ? 'Live' : 'Draft';

  return props.index.filter((item) => {
    const hasTag = item.tags.includes(needle);
    if (!filterNumber.value) return hasTag;

    return hasTag && item.number.toString().startsWith(filterNumber.value);
  });
});

const onTap = (item: IndexReadyItem) => {
  if (currentTab.value === 'Draft') {
    router.get(`/${shared.locale}/story/${props.story.id}/draft/${item.number}/edit`);
  } else {
    router.get(`/${shared.locale}/story/${props.story.id}/chapter/${item.number}`);
  }
};

const editMeta = () => router.get(`/${shared.locale}/story/${props.story.id}/edit`);

const closeSearch = () => {
  showSearch.value = false;
  filterNumber.value = null;
};

const toggleSearch = async () => {
  showSearch.value = !showSearch.value;

  if (showSearch.value) {
    await nextTick();
    searchInput.value?.focus();
  } else {
    filterNumber.value = null;
  }
};

const onClickOutside = (event: MouseEvent) => {
  if (!showSearch.value) return;

  const target = event.target as Node;
  if (searchContainer.value && !searchContainer.value.contains(target)) {
    closeSearch();
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
});
</script>

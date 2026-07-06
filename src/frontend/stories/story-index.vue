<template>
  <AppLayout :title="story.storyType" :subtitle="story.name">
    <template #actions>
      <StudioButton
        v-if="canEditStory"
        label="Edit"
        variant="outline"
        @click="editMeta"
      />
      <StudioButton
        v-if="canEditStory && !story.isPublished"
        label="Publish"
        variant="green"
        :tooltip="publishBlockedReason ?? undefined"
        :disabled="isPublishing || !canPublishStoryReady"
        @click="publishStory"
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
            class="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 font-dmsans text-sm font-medium text-gray-500"
            disabled
          >
            {{ `No more ${story.chapterType}s available to translate` }}
          </button>
        </div>

        <div class="flex shrink-0 items-center gap-3">
          <ExpandableSearch
            v-model="filterQuery"
            :placeholder="`Search`"
            clear-on-collapse
          />
          <ListSwitcher :is-list="isList" @toggle="isList = !isList" />
        </div>
      </div>
    </template>
    <template #main>
      <div
        v-if="filteredIndex.length > 0 && !isList"
        class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <index-card
          v-for="item in filteredIndex"
          :key="item.number"
          class="h-full"
          :item="item"
          :is-list="false"
          placeholder-image="https://res.cloudinary.com/redeem/image/upload/v1752849347/story-cms-ui/placeholder_bafmfz.jpg"
          :scope="currentTab"
          :chapter-name="story.chapterType"
          @tap="onTap"
        />
      </div>

      <div
        v-else-if="filteredIndex.length > 0 && isList"
        class="overflow-x-auto rounded-xl border border-gray-200 bg-white"
      >
        <table class="w-full table-auto">
          <thead class="border-b border-gray-200 bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Chapter
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <index-card
              v-for="item in filteredIndex"
              :key="item.number"
              :item="item"
              :is-list="true"
              placeholder-image="https://res.cloudinary.com/redeem/image/upload/v1752849347/story-cms-ui/placeholder_bafmfz.jpg"
              :scope="currentTab"
              :chapter-name="story.chapterType"
              @tap="onTap"
            />
          </tbody>
        </table>
      </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { Plus } from '@lucide/vue';
import { computed, ref } from 'vue';

import { IndexReadyItem, SharedPageProps, StoryIndexProps, AddStatus, ResponseStatus } from '../../types';
import { canPublishStory, publishBlockedMessage } from '../../shared/story_helpers';
import AppLayout from '../shared/app-layout.vue';
import ExpandableSearch from '../shared/expandable-search.vue';
import GlassButton from '../shared/glass-button.vue';
import { padZero } from '../shared/helpers';
import ListSwitcher from '../shared/list-switcher.vue';
import StudioButton from '../shared/studio-button.vue';
import { useSharedStore } from '../store';
import IndexCard from './components/index-card.vue';

const props = defineProps<StoryIndexProps & SharedPageProps>();

const shared = useSharedStore();

shared.setFromProps(props);
shared.setCurrentStoryName(props.story.name);

const isList = ref(false);
const filterQuery = ref('');
const currentTab = ref('Live');
const isPublishing = ref(false);

const liveCount = computed(
  () => props.index.filter((item) => item.tags.includes('Live')).length,
);

const draftCount = computed(
  () => props.index.filter((item) => item.tags.includes('Draft')).length,
);

const canPublishStoryReady = computed(() =>
  canPublishStory(liveCount.value, props.story.chapterLimit),
);

const publishBlockedReason = computed(() =>
  publishBlockedMessage(
    liveCount.value,
    props.story.chapterLimit,
    props.story.chapterType,
    props.story.storyType,
  ),
);

const addDraft = () =>
  router.get(`/${shared.locale}/story/${props.story.id}/draft/create`);

const onFilter = (tab: string) => {
  currentTab.value = tab;
};

const filteredIndex = computed(() => {
  const tabTag = currentTab.value === 'Live' ? 'Live' : 'Draft';
  const query = filterQuery.value.trim().toLowerCase();

  return props.index.filter((item) => {
    if (!item.tags.includes(tabTag)) return false;
    if (!query) return true;

    const paddedNumber = padZero(item.number);
    const title = item.title.toLowerCase();
    const chapterLabel = `${props.story.chapterType} ${item.number}`.toLowerCase();
    const chapterLabelPadded = `${props.story.chapterType} ${paddedNumber}`.toLowerCase();

    return (
      item.number.toString().includes(query) ||
      paddedNumber.includes(query) ||
      title.includes(query) ||
      chapterLabel.includes(query) ||
      chapterLabelPadded.includes(query)
    );
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

const validationFailureMessage = (validationErrors: Record<string, string | string[]>) =>
  Object.keys(validationErrors).length > 0
    ? 'Some required fields are missing'
    : 'Something went wrong. Please try again.';

const publishStory = () => {
  if (props.story.isPublished || !canPublishStoryReady.value) return;

  shared.clearErrors();
  isPublishing.value = true;

  router.post(`/${shared.locale}/story/${props.story.id}/publish`, {}, {
    preserveScroll: true,

    onSuccess: (page) => {
      const flashError = (page.props as { flash?: { error?: string } }).flash?.error;
      if (flashError) {
        shared.addMessage(ResponseStatus.Failure, flashError);
        return;
      }
      shared.addMessage(ResponseStatus.Confirmation, 'Story published successfully!');
    },

    onError: (validationErrors) => {
      shared.setErrors(validationErrors);
      shared.addMessage(
        ResponseStatus.Failure,
        validationFailureMessage(validationErrors),
      );
    },

    onFinish: () => {
      isPublishing.value = false;
    },
  });
};
</script>

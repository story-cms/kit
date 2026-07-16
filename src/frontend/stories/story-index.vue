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
        :disabled="isPublishing || !canPublishStoryReadyState"
        @click="publishStory"
      />
    </template>
    <template #controls>
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div class="flex flex-wrap items-center gap-3">
          <IndexFilter :tabs="tabs" :current-tab="currentTab" @change="onFilter" />

          <StudioButton
            v-if="addStatus == AddStatus.Add"
            :label="story.chapterType"
            variant="outline"
            shape="cta"
            @click="addDraft"
          >
            <Plus class="size-4" aria-hidden="true" />
          </StudioButton>
          <p
            v-if="addStatus == AddStatus.Wait"
            class="font-dmsans text-xs font-normal leading-5 text-gray-600"
          >
            {{ `No more ${story.chapterType}s available to translate` }}
          </p>
          <p
            v-if="addStatus == AddStatus.Full && !story.isPublished"
            class="font-dmsans text-xs font-normal leading-5 text-gray-600"
          >
            {{ `All ${story.chapterType}s created` }}
          </p>
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
        class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        <index-card
          v-for="item in filteredIndex"
          :key="item.number"
          class="h-full"
          :item="item"
          :is-list="false"
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
              <th
                class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Status
              </th>
              <th
                class="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <index-card
              v-for="item in filteredIndex"
              :key="item.number"
              :item="item"
              :is-list="true"
              :can-edit="canEditStory !== false"
              :scope="currentTab"
              :chapter-name="story.chapterType"
              @tap="onTap"
              @edit="onEdit"
              @preview="onPreview"
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

import {
  IndexReadyItem,
  SharedPageProps,
  StoryIndexProps,
  AddStatus,
  ResponseStatus,
  TabItem,
} from '../../types';
import {
  canPublishStoryReady,
  storyPublishBlockedMessage,
} from '../../shared/story_helpers';
import AppLayout from '../shared/app-layout.vue';
import ExpandableSearch from '../shared/expandable-search.vue';
import IndexFilter from '../shared/index-filter.vue';
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
const currentTab = ref(props.story.isPublished ? 'Live' : 'Ready');
const isPublishing = ref(false);

const liveCount = computed(
  () => props.index.filter((item) => item.tags.includes('Live')).length,
);

const draftCount = computed(
  () => props.index.filter((item) => item.tags.includes('Draft')).length,
);

const liveTabLabel = computed(() => (props.story.isPublished ? 'Live' : 'Ready'));

const draftTabLabel = computed(() => (props.story.isPublished ? 'Changes' : 'Draft'));

const tabs = computed((): TabItem[] => [
  { label: liveTabLabel.value, count: liveCount.value },
  { label: draftTabLabel.value, count: draftCount.value },
]);

const publishMetadata = computed(() => ({
  title: props.story.name,
  coverImage: props.story.coverImage,
  storyType: props.story.storyType,
  chapterType: props.story.chapterType,
  visibility: props.story.visibility,
}));

const canPublishStoryReadyState = computed(() =>
  canPublishStoryReady(liveCount.value, props.story.chapterLimit, publishMetadata.value),
);

const publishBlockedReason = computed(() =>
  storyPublishBlockedMessage(
    liveCount.value,
    props.story.chapterLimit,
    publishMetadata.value,
  ),
);

const addDraft = () =>
  router.get(`/${shared.locale}/story/${props.story.id}/draft/create`);

const onFilter = (tab: string) => {
  currentTab.value = tab;
};

const isLiveScope = (tab: string) => tab === 'Live' || tab === 'Ready';

const filteredIndex = computed(() => {
  const tabTag = isLiveScope(currentTab.value) ? 'Live' : 'Draft';
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
  router.get(
    item.tags.includes('Live')
      ? chapterPreviewUrl(item.number)
      : draftEditUrl(item.number),
  );
};

const onEdit = (item: IndexReadyItem) => router.get(draftEditUrl(item.number));

const onPreview = (item: IndexReadyItem) => router.get(chapterPreviewUrl(item.number));

const chapterPreviewUrl = (number: number) =>
  `/${shared.locale}/story/${props.story.id}/chapter/${number}`;

const draftEditUrl = (number: number) =>
  `/${shared.locale}/story/${props.story.id}/draft/${number}/edit`;

const editMeta = () => router.get(`/${shared.locale}/story/${props.story.id}/edit`);

const validationFailureMessage = (validationErrors: Record<string, string | string[]>) =>
  Object.keys(validationErrors).length > 0
    ? 'Some required fields are missing'
    : 'Something went wrong. Please try again.';

const publishStory = () => {
  if (props.story.isPublished || !canPublishStoryReadyState.value) return;

  shared.clearErrors();
  isPublishing.value = true;

  router.post(
    `/${shared.locale}/story/${props.story.id}/publish`,
    {},
    {
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
    },
  );
};
</script>

<template>
  <AppLayout :title="pageTitle" :subtitle="headerSubtitle">
    <template #actions>
      <StudioButton
        :label="saveButtonLabel"
        variant="primary"
        :disabled="isSaving"
        @click="saveChapter"
      />
    </template>
    <template #controls>
      <TabNavigation
        :tabs="chapterEditTabs"
        :icons="chapterEditTabIcons"
        :current-tab="currentChapterTab"
        @change="onChapterTabChange"
      />
    </template>
    <template #main>
      <div class="relative">
        <form :dir="shared.isRtl ? 'rtl' : 'ltr'">
          <ChapterEditDetails
            v-if="currentChapterTab === 'Details'"
            :chapter-type="props.story.chapterType"
          />
          <div v-if="currentChapterTab === 'Blocks'" dir="ltr">
            <ChapterEditBlocks
              v-model:blocks="blocks"
              :video-collection-id="props.config.videoCollectionId"
            />
          </div>
          <div v-if="currentChapterTab === 'Resources'" dir="ltr">
            <StoryEditResources
              v-model:resources="attachedResources"
              :available-resources="availableResources"
              @create="createResource"
            />
          </div>
        </form>
      </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { router } from '@inertiajs/vue3';
import { BookOpen, FolderClosed, LayoutGrid } from '@lucide/vue';

import type {
  ChapterEditProps,
  NavigationPaneTab,
  ResourceItem,
  SharedPageProps,
  ChapterBlock,
} from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore, useWidgetsStore, useModelStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import StudioButton from '../shared/studio-button.vue';
import TabNavigation from '../shared/tab-navigation.vue';
import ChapterEditDetails from './components/chapter-edit-details.vue';
import ChapterEditBlocks from './components/chapter-edit-blocks.vue';
import StoryEditResources from './components/story-edit-resources.vue';
import { resourceIds } from './components/resource-utils';
import {
  chapterEditTabHasError,
  firstChapterEditTabWithError,
} from './chapter-edit-tab-errors';

const resolveChapterTab = (value: string | null, tabs: NavigationPaneTab[]): string => {
  if (!value) return 'Details';
  const match = tabs.find((tab) => tab.label.toLowerCase() === value.toLowerCase());
  return match?.label ?? 'Details';
};

const props = defineProps<ChapterEditProps & SharedPageProps>();

const shared = useSharedStore();
const { errors } = storeToRefs(shared);
shared.setFromProps(props);
if (Object.keys(props.errors ?? {}).length === 0) {
  shared.clearErrors();
}
useWidgetsStore().setProviders(props.providers);

const model = useModelStore();
model.setModel(props.bundle);

const blocks = ref<ChapterBlock[]>(
  props.bundle.blocks?.length ? [...props.bundle.blocks] : [],
);
const attachedResources = ref<ResourceItem[]>([...(props.bundle.resources ?? [])]);
const availableResources = props.availableResources ?? [];
const isSaving = ref(false);

watch(
  blocks,
  (value) => {
    model.setField('blocks', value);
  },
  { deep: true, immediate: true },
);

watch(
  attachedResources,
  (value) => {
    model.setField('resources', value);
  },
  { deep: true, immediate: true },
);

const attachResourceId = new URLSearchParams(window.location.search).get('attachResource');
if (attachResourceId) {
  const resource = availableResources.find((item) => item.id === attachResourceId);
  if (resource && !attachedResources.value.some((item) => item.id === attachResourceId)) {
    attachedResources.value = [...attachedResources.value, resource];
  }
}

const title = ref(props.bundle.title);

model.$subscribe(() => {
  title.value = model.getField('title', '');
});

const pageTitle = computed(() =>
  props.isCreate ? 'Add Chapter' : `Edit ${props.story.chapterType ?? 'Chapter'}`,
);

const headerSubtitle = computed(() => {
  if (props.isCreate) return 'Create a new chapter';
  return title.value?.trim() || `Edit ${props.story.chapterType ?? 'Chapter'}`;
});

const saveButtonLabel = computed(() => (props.isCreate ? 'Create Chapter' : 'Save Changes'));

const chapterEditTabs = computed((): NavigationPaneTab[] => [
  {
    label: 'Details',
    hasError: chapterEditTabHasError('details', errors.value),
  },
  {
    label: 'Blocks',
    hasError: chapterEditTabHasError('blocks', errors.value),
  },
  {
    label: 'Resources',
    hasError: chapterEditTabHasError('resources', errors.value),
  },
]);

const chapterEditTabIcons = computed(() => ({
  Details: BookOpen,
  Blocks: LayoutGrid,
  Resources: FolderClosed,
}));

const initialTabs: NavigationPaneTab[] = [
  { label: 'Details' },
  { label: 'Blocks' },
  { label: 'Resources' },
];

const currentChapterTab = ref(
  resolveChapterTab(new URLSearchParams(window.location.search).get('tab'), initialTabs),
);

const onChapterTabChange = (tab: string) => {
  currentChapterTab.value = tab;
};

const focusFirstErroredTab = () => {
  const tab = firstChapterEditTabWithError(errors.value);
  if (tab) {
    currentChapterTab.value = tab;
  }
};

const validationFailureMessage = (validationErrors: Record<string, string | string[]>) =>
  Object.keys(validationErrors).length > 0
    ? 'Some required fields are missing'
    : 'Something went wrong. Please try again.';

onMounted(() => {
  if (Object.keys(props.errors ?? {}).length > 0) {
    focusFirstErroredTab();
  }
});

const createResource = () => {
  const params = new URLSearchParams(window.location.search);
  params.set('tab', 'Resources');
  const returnTo = `${window.location.pathname}?${params.toString()}`;
  const encodedReturnTo = encodeURIComponent(returnTo);
  router.visit(`/${shared.locale}/resource/create?returnTo=${encodedReturnTo}`);
};

const getPayload = () => ({
  bundle: {
    number: model.getField('number', ''),
    title: model.getField('title', ''),
    description: model.getField('description', ''),
    coverImage: model.getField('coverImage', ''),
    devotionAudio: model.getField('devotionAudio', ''),
    blocks: model.getField('blocks', []),
    resources: resourceIds(attachedResources.value),
  },
});

const saveChapter = () => {
  shared.clearErrors();
  isSaving.value = true;

  router.post(
    `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/save`,
    getPayload(),
    {
      preserveScroll: true,

      onSuccess: () => {
        shared.addMessage(
          ResponseStatus.Confirmation,
          props.isCreate ? 'Chapter created successfully' : 'Chapter saved successfully',
        );
      },

      onError: (validationErrors) => {
        shared.setErrors(validationErrors);
        focusFirstErroredTab();
        shared.addMessage(
          ResponseStatus.Failure,
          validationFailureMessage(validationErrors),
        );
      },

      onFinish: () => {
        isSaving.value = false;
      },
    },
  );
};
</script>

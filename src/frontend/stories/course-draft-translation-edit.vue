<template>
  <AppLayout title="Draft" :subtitle="chapterTitle">
    <template #actions>
      <DraftEditActions
        :has-edit-review="props.hasEditReview"
        @delete="deleteDraft"
        @publish="publishDraft"
        @request-change="reject"
        @submit="submitDraft"
      />
    </template>
    <template #controls>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <nav aria-label="Language columns">
          <div class="flex flex-wrap gap-1">
            <TabButton
              :label="shared.language.language"
              :is-active="false"
              :is-action="false"
            >
              <Eye aria-hidden="true" />
            </TabButton>

            <TabButton
              :label="sourceLanguageName"
              :is-active="shared.showSourceColumn"
              :aria-pressed="shared.showSourceColumn"
              @click="shared.setSourceColumnAsHidden(!shared.showSourceColumn)"
            >
              <Eye v-if="shared.showSourceColumn" aria-hidden="true" />
              <EyeOff v-else aria-hidden="true" />
            </TabButton>
          </div>
        </nav>

        <TabNavigation
          :tabs="courseDraftEditTabs"
          :icons="courseDraftEditTabIcons"
          :current-tab="currentCourseDraftTab"
          @change="onCourseDraftTabChange"
        />
      </div>
    </template>
    <template #main>
      <div
        :class="[
          'relative grid min-h-screen',
          {
            'grid-cols-[1fr_375px] gap-x-4': !shared.isSingleColumn,
            'mx-auto grid-cols-1': shared.isSingleColumn && !shared.showSourceColumn,
          },
        ]"
      >
        <div ref="sourceSection" class="subgrid row-[span_1000]">
          <form :dir="shared.isRtl ? 'rtl' : 'ltr'" class="subgrid row-[span_1000] gap-y-4">
            <CourseDraftEditDetails
              v-if="currentCourseDraftTab === 'Details'"
              :chapter-type="props.story.chapterType"
              :is-translation="true"
            />
            <div v-if="currentCourseDraftTab === 'Blocks'" dir="ltr">
              <CourseDraftEditBlocks
                v-model:blocks="blocks"
                :video-collection-id="props.config.videoCollectionId"
                :chapter-type="props.story.chapterType"
                :template="props.story.template"
                :is-translation="true"
              />
            </div>
            <div v-if="currentCourseDraftTab === 'Resources'" dir="ltr">
              <StoryEditResources
                v-model:resources="attachedResources"
                :available-resources="availableResources"
                @create="createResource"
              />
            </div>
          </form>
        </div>
        <ContentSidebar
          :is-complex-layout="true"
          :style="{ marginRight: `${marginRight}px` }"
        >
          <template #meta-box>
            <MetaBox
              :primary="[
                { label: props.story.storyType, value: props.story.name },
                { label: props.story.chapterType, value: metaChapter },
              ]"
              :secondary="[
                { label: 'Created', value: formatDate(props.draft.createdAt) },
                { label: 'Auto-Saved', value: formatDate(props.draft.updatedAt) },
                { label: 'Last Published', value: publishedWhen },
              ]"
            />
          </template>
          <template #app-preview>
            <div v-if="shared.config.hasAppPreview">
              <MobileAppPreview
                v-if="props.bundle"
                :bundle="props.bundle"
                :number="props.draft.number"
                class="mt-2"
              />
            </div>
          </template>
        </ContentSidebar>
      </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { router } from '@inertiajs/vue3';
import type { Errors } from '@inertiajs/core';
import { BookOpen, FolderClosed, Blocks, Eye, EyeOff } from '@lucide/vue';

import type {
  ChapterBlock,
  CourseDraftEditProps,
  DraftEditProps,
  NavigationPaneTab,
  ResourceItem,
  SharedPageProps,
} from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore, useWidgetsStore, useModelStore, useDraftsStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import TabButton from '../shared/tab-button.vue';
import TabNavigation from '../shared/tab-navigation.vue';
import ContentSidebar from '../shared/content-sidebar.vue';
import MetaBox from '../shared/meta-box.vue';
import MobileAppPreview from '../shared/mobile-app-preview.vue';
import DraftEditActions from './components/draft-edit-actions.vue';
import CourseDraftEditDetails from './components/course-draft-edit-details.vue';
import CourseDraftEditBlocks from './components/course-draft-edit-blocks.vue';
import StoryEditResources from './components/story-edit-resources.vue';
import { resourceIds } from './components/resource-utils';
import {
  chapterDraftEditTabHasError,
  firstChapterDraftEditTabWithError,
} from './chapter-draft-edit-tab-errors';
import { normalizedBlocks } from './components/blocks/block-utils';
import { useTranslationDraftLayout } from './use-translation-draft-layout';
import { debounce, formatDate, padZero, safeChapterTitle } from '../shared/helpers';

const findCourseDraftTab = (
  value: string | null,
  tabs: NavigationPaneTab[],
): string => {
  if (!value) return 'Details';
  const match = tabs.find((tab) => tab.label.toLowerCase() === value.toLowerCase());
  return match?.label ?? 'Details';
};

const props = defineProps<CourseDraftEditProps & SharedPageProps>();

const shared = useSharedStore();
const { errors } = storeToRefs(shared);
shared.setFromProps(props);

const widgets = useWidgetsStore();
widgets.setProviders(props.providers);

const drafts = useDraftsStore();
drafts.setFromProps(props as DraftEditProps);

watch(
  () => props.draft.updatedAt,
  (updatedAt) => drafts.setUpdatedAt(updatedAt),
  { immediate: true },
);

const model = useModelStore();
model.setFromProps(props as DraftEditProps & SharedPageProps);

const sourceSection = ref<HTMLElement | null>(null);
const { sourceLanguageName, marginRight } = useTranslationDraftLayout(sourceSection);

const blocks = ref<ChapterBlock[]>(
  props.bundle.blocks?.length ? normalizedBlocks([...props.bundle.blocks]) : [],
);
const attachedResources = ref<ResourceItem[]>([...(props.bundle.resources ?? [])]);
const availableResources = props.availableResources ?? [];

let isSettingErrors = false;

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

const defaultTitle = computed(() => `New ${props.story.chapterType}`);
const title = ref(props.bundle.title);

const chapterTitle = computed(() => {
  if (title.value === defaultTitle.value) return defaultTitle.value;
  return (
    safeChapterTitle(title.value, props.story.name, props.draft.number) ??
    defaultTitle.value
  );
});

const metaChapter = computed(
  () => `${padZero(props.draft.number)} of ${padZero(props.story.chapterLimit)}`,
);

const publishedWhen = computed(() =>
  props.lastPublished === '' ? 'Unpublished' : formatDate(props.lastPublished),
);

const courseDraftEditTabs = computed((): NavigationPaneTab[] => [
  {
    label: 'Details',
    hasError: chapterDraftEditTabHasError('details', errors.value),
  },
  {
    label: 'Blocks',
    hasError: chapterDraftEditTabHasError('blocks', errors.value),
  },
  {
    label: 'Resources',
    hasError: chapterDraftEditTabHasError('resources', errors.value),
  },
]);

const courseDraftEditTabIcons = computed(() => ({
  Details: BookOpen,
  Blocks: Blocks,
  Resources: FolderClosed,
}));

const initialTabs: NavigationPaneTab[] = [
  { label: 'Details' },
  { label: 'Blocks' },
  { label: 'Resources' },
];

const currentCourseDraftTab = ref(
  findCourseDraftTab(
    new URLSearchParams(window.location.search).get('tab'),
    initialTabs,
  ),
);

const onCourseDraftTabChange = (tab: string) => {
  currentCourseDraftTab.value = tab;
};

const focusFirstErroredTab = () => {
  const tab = firstChapterDraftEditTabWithError(errors.value);
  if (tab) {
    currentCourseDraftTab.value = tab;
  }
};

const getPayload = () => ({
  feedback: '',
  bundle: {
    ...model.model,
    resources: resourceIds(attachedResources.value),
  },
});

const onSuccess = (message?: string) => {
  widgets.setIsDirty(false);
  if (!message) return;
  shared.addMessage(ResponseStatus.Confirmation, message);
};

const onError = (validationErrors: Errors, message: string) => {
  widgets.setIsDirty(false);
  isSettingErrors = true;
  shared.setErrors(validationErrors);
  focusFirstErroredTab();
  shared.addMessage(ResponseStatus.Failure, message);
};

const saveDraft = debounce(2000, () => {
  router.post(
    `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/save`,
    getPayload(),
    {
      preserveScroll: true,
      onSuccess: () => {
        onSuccess();
        if (props.user.role === 'admin') return;
        drafts.setStatus('started');
      },
      onError: (e) => onError(e, 'Error saving draft.'),
    },
  );
});

const deleteDraft = () => {
  router.delete(`/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}`, {
    onSuccess: () => onSuccess('Draft successfully deleted'),
    onError: (e) => onError(e, 'Error deleting draft'),
  });
};

const submitDraft = () => {
  router.post(
    `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/submit`,
    getPayload(),
    {
      preserveScroll: true,
      onSuccess: () => onSuccess(`${props.story.chapterType} submitted for review`),
      onError: (e) =>
        onError(e, 'Draft not submitted. Please review and correct any errors.'),
    },
  );
};

const publishDraft = () => {
  widgets.setIsDirty(true);
  router.post(
    `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/publish`,
    getPayload(),
    {
      preserveScroll: true,
      onSuccess: () => onSuccess('Draft successfully published.'),
      onError: (e) =>
        onError(e, 'Draft not published. Please review and correct any errors.'),
    },
  );
};

const reject = () => {
  router.post(
    `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/reject`,
    getPayload(),
    {
      preserveScroll: true,
      onSuccess: () => onSuccess('Draft sent back for fixing.'),
      onError: (e) => onError(e, 'Draft could not be sent back.'),
    },
  );
};

const createResource = () => {
  const params = new URLSearchParams(window.location.search);
  params.set('tab', 'Resources');
  const returnTo = `${window.location.pathname}?${params.toString()}`;
  const encodedReturnTo = encodeURIComponent(returnTo);
  router.visit(`/${shared.locale}/resource/create?returnTo=${encodedReturnTo}`);
};

onMounted(() => {
  if (Object.keys(props.errors ?? {}).length > 0) {
    focusFirstErroredTab();
  }

  model.$subscribe(() => {
    if (isSettingErrors) {
      isSettingErrors = false;
      return;
    }
    widgets.setIsDirty(true);
    title.value = model.getField('title', defaultTitle.value);
    saveDraft();
  });
});
</script>

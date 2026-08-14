<template>
  <AppLayout :title="pageTitle" :subtitle="headerSubtitle">
    <template #actions>
      <div class="flex flex-col flex-wrap items-start gap-1 md:flex-row md:items-center">
        <button
          type="button"
          class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label="Delete draft"
          @click="deleteDraft"
        >
          <Trash2 class="size-5" aria-hidden="true" />
        </button>
        <WorkflowActions
          :has-edit-review="props.hasEditReview"
          @publish="publish"
          @request-change="reject"
          @submit="submit"
        />
        <StudioButton
          :label="saveButtonLabel"
          variant="primary"
          :disabled="isSaving"
          @click="saveDevotionDraft"
        />
      </div>
    </template>
    <template #controls>
      <TabNavigation
        :tabs="devotionDraftEditTabs"
        :icons="devotionDraftEditTabIcons"
        :current-tab="currentDevotionDraftTab"
        @change="onDevotionDraftTabChange"
      />
    </template>
    <template #main>
      <div class="relative">
        <form :dir="shared.isRtl ? 'rtl' : 'ltr'">
          <DevotionDraftEditDetails
            v-if="currentDevotionDraftTab === 'Details'"
            :chapter-type="props.story.chapterType"
          />
          <div v-if="currentDevotionDraftTab === 'Blocks'" dir="ltr">
            <DevotionDraftEditBlocks
              v-model:blocks="blocks"
              :video-collection-id="props.config.videoCollectionId"
              :chapter-type="props.story.chapterType"
            />
          </div>
          <div v-if="currentDevotionDraftTab === 'Resources'" dir="ltr">
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { router } from '@inertiajs/vue3';
import type { Errors } from '@inertiajs/core';
import { BookOpen, FolderClosed, Blocks, Trash2 } from '@lucide/vue';

import type {
  DevotionDraftEditProps,
  DraftEditProps,
  NavigationPaneTab,
  ResourceItem,
  SharedPageProps,
  ChapterBlock,
} from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore, useWidgetsStore, useModelStore, useDraftsStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import StudioButton from '../shared/studio-button.vue';
import TabNavigation from '../shared/tab-navigation.vue';
import DevotionDraftEditDetails from './components/devotion-draft-edit-details.vue';
import DevotionDraftEditBlocks from './components/devotion-draft-edit-blocks.vue';
import StoryEditResources from './components/story-edit-resources.vue';
import WorkflowActions from './components/workflow-actions.vue';
import { resourceIds } from './components/resource-utils';
import {
  devotionDraftEditTabHasError,
  firstDevotionDraftEditTabWithError,
} from './devotion-draft-edit-tab-errors';
import { normalizeBlocks } from './components/blocks/block-utils';

const resolveDevotionDraftTab = (
  value: string | null,
  tabs: NavigationPaneTab[],
): string => {
  if (!value) return 'Details';
  const match = tabs.find((tab) => tab.label.toLowerCase() === value.toLowerCase());
  return match?.label ?? 'Details';
};

const props = defineProps<DevotionDraftEditProps & SharedPageProps>();

const shared = useSharedStore();
const { errors } = storeToRefs(shared);
shared.setFromProps(props);
if (Object.keys(props.errors ?? {}).length === 0) {
  shared.clearErrors();
}

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
model.setModel(props.bundle);

const blocks = ref<ChapterBlock[]>(
  props.bundle.blocks?.length ? normalizeBlocks([...props.bundle.blocks]) : [],
);
const attachedResources = ref<ResourceItem[]>([...(props.bundle.resources ?? [])]);
const availableResources = props.availableResources ?? [];
const isSaving = ref(false);

let isSettingErrors = false;
let autosaveTimeout: ReturnType<typeof setTimeout> | null = null;

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

const attachResourceId = new URLSearchParams(window.location.search).get(
  'attachResource',
);
if (attachResourceId) {
  const resource = availableResources.find((item) => item.id === attachResourceId);
  if (resource && !attachedResources.value.some((item) => item.id === attachResourceId)) {
    attachedResources.value = [...attachedResources.value, resource];
  }
}

const defaultTitle = computed(() => `New ${props.story.chapterType}`);
const title = ref(props.bundle.title);

const pageTitle = computed(() =>
  props.isCreate ? 'Add Chapter' : `Edit ${props.story.chapterType ?? 'Chapter'}`,
);

const headerSubtitle = computed(() => {
  if (props.isCreate) return 'Create a new chapter';
  return title.value?.trim() || `Edit ${props.story.chapterType ?? 'Chapter'}`;
});

const saveButtonLabel = computed(() =>
  props.isCreate ? 'Create Chapter' : 'Save Changes',
);

const devotionDraftEditTabs = computed((): NavigationPaneTab[] => [
  {
    label: 'Details',
    hasError: devotionDraftEditTabHasError('details', errors.value),
  },
  {
    label: 'Blocks',
    hasError: devotionDraftEditTabHasError('blocks', errors.value),
  },
  {
    label: 'Resources',
    hasError: devotionDraftEditTabHasError('resources', errors.value),
  },
]);

const devotionDraftEditTabIcons = computed(() => ({
  Details: BookOpen,
  Blocks: Blocks,
  Resources: FolderClosed,
}));

const initialTabs: NavigationPaneTab[] = [
  { label: 'Details' },
  { label: 'Blocks' },
  { label: 'Resources' },
];

const currentDevotionDraftTab = ref(
  resolveDevotionDraftTab(
    new URLSearchParams(window.location.search).get('tab'),
    initialTabs,
  ),
);

const onDevotionDraftTabChange = (tab: string) => {
  currentDevotionDraftTab.value = tab;
};

const focusFirstErroredTab = () => {
  const tab = firstDevotionDraftEditTabWithError(errors.value);
  if (tab) {
    currentDevotionDraftTab.value = tab;
  }
};

const validationFailureMessage = (validationErrors: Record<string, string | string[]>) =>
  Object.keys(validationErrors).length > 0
    ? 'Some required fields are missing'
    : 'Something went wrong. Please try again.';

const getBundle = () => ({
  number: model.getField('number', ''),
  title: model.getField('title', ''),
  description: model.getField('description', ''),
  coverImage: model.getField('coverImage', ''),
  devotionAudio: model.getField('devotionAudio', { url: null, length: null }),
  blocks: model.getField('blocks', []),
  resources: resourceIds(attachedResources.value),
});

const getPayload = () => ({
  feedback: '',
  bundle: getBundle(),
});

const cancelAutosave = () => {
  if (autosaveTimeout !== null) {
    clearTimeout(autosaveTimeout);
    autosaveTimeout = null;
  }
};

const onSaveSuccess = (message?: string) => {
  widgets.setIsDirty(false);
  if (!message) return;
  shared.addMessage(ResponseStatus.Confirmation, message);
};

const onSaveError = (validationErrors: Errors, message: string) => {
  widgets.setIsDirty(false);
  isSettingErrors = true;
  shared.setErrors(validationErrors);
  focusFirstErroredTab();
  shared.addMessage(ResponseStatus.Failure, message);
};

const postSave = (options?: { message?: string; focusErrors?: boolean }) => {
  router.post(
    `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/save`,
    getPayload(),
    {
      preserveScroll: true,
      onSuccess: () => {
        onSaveSuccess(options?.message);
        if (props.user.role === 'admin') return;
        drafts.setStatus('started');
      },
      onError: (validationErrors) => {
        widgets.setIsDirty(false);
        isSettingErrors = true;
        shared.setErrors(validationErrors);
        if (options?.focusErrors) {
          focusFirstErroredTab();
        }
        shared.addMessage(
          ResponseStatus.Failure,
          options?.focusErrors
            ? validationFailureMessage(validationErrors)
            : `${props.story.chapterType} not saved`,
        );
      },
      onFinish: () => {
        isSaving.value = false;
      },
    },
  );
};

const scheduleAutosave = () => {
  cancelAutosave();
  autosaveTimeout = setTimeout(() => {
    autosaveTimeout = null;
    postSave();
  }, 2000);
};

const saveDevotionDraft = () => {
  cancelAutosave();
  shared.clearErrors();
  isSaving.value = true;
  postSave({
    message: props.isCreate
      ? 'Chapter created successfully'
      : 'Chapter saved successfully',
    focusErrors: true,
  });
};

const deleteDraft = () => {
  cancelAutosave();
  router.delete(`/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}`, {
    onSuccess: () => onSaveSuccess('Draft successfully deleted'),
    onError: (e) => onSaveError(e, 'Error deleting draft'),
  });
};

const submit = () => {
  cancelAutosave();
  router.post(
    `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/submit`,
    getPayload(),
    {
      onSuccess: () => onSaveSuccess(`${props.story.chapterType} submitted for review`),
      onError: (e) =>
        onSaveError(e, 'Draft not submitted. Please review and correct any errors.'),
    },
  );
};

const publish = () => {
  cancelAutosave();
  widgets.setIsDirty(true);
  router.post(
    `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/publish`,
    getPayload(),
    {
      onSuccess: () => onSaveSuccess(`${props.story.chapterType} published successfully`),
      onError: (e) =>
        onSaveError(
          e,
          `${props.story.chapterType} not published. Please review and correct any errors.`,
        ),
    },
  );
};

const reject = () => {
  cancelAutosave();
  router.post(
    `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/reject`,
    getPayload(),
    {
      onSuccess: () => onSaveSuccess('Draft sent back for fixing'),
      onError: (e) => onSaveError(e, 'Error sending draft back'),
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
    scheduleAutosave();
    title.value = model.getField('title', defaultTitle.value);
  });
});

onUnmounted(() => {
  cancelAutosave();
});
</script>

<template>
  <AppLayout title="Edit Story" :subtitle="headerSubtitle">
    <template #actions>
      <StudioButton
        v-if="props.hasNoContent"
        label="Delete"
        variant="red"
        :disabled="isSaving"
        @click="deleteStory"
      >
        <Trash2 class="size-4" aria-hidden="true" />
      </StudioButton>
      <StudioButton
        label="Save Changes"
        variant="secondary"
        :disabled="isSaving"
        @click="saveStory"
      />
    </template>
    <template #controls>
      <TabNavigation
        :tabs="storyEditTabs"
        :icons="storyEditTabIcons"
        :current-tab="currentStoryTab"
        @change="onStoryTabChange"
      />
    </template>
    <template #main>
      <div class="relative">
        <form :dir="shared.isRtl ? 'rtl' : 'ltr'">
          <StoryEditDetails
            v-if="currentStoryTab === 'Details'"
            :is-published="props.model.isPublished"
            :is-translation="shared.isTranslation"
            :is-editing="true"
            :templates="props.templates"
          />
          <!-- TODO(sections): re-enable when spec is ready
          <StoryEditSections
            v-if="currentStoryTab === `${sectionType ?? 'Section'}s`"
            :section-type="sectionType"
            :tab-icon="currentStoryTabIcon"
          />
          -->
          <div v-if="currentStoryTab === 'Resources'" dir="ltr">
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
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { router } from '@inertiajs/vue3';
import { Trash2, BookOpen, FolderClosed } from '@lucide/vue';

import type {
  NavigationPaneTab,
  ResourceItem,
  SharedPageProps,
  StoryEditProps,
} from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore, useWidgetsStore, useModelStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import StudioButton from '../shared/studio-button.vue';
import TabNavigation from '../shared/tab-navigation.vue';
import StoryEditDetails from './components/story-edit-details.vue';
// TODO(sections): re-enable when spec is ready
// import StoryEditSections from './components/story-edit-sections.vue';
import StoryEditResources from './components/story-edit-resources.vue';
import { resourceIds } from './components/resource-utils';
import {
  firstStoryEditTabWithError,
  storyEditTabHasError,
} from './story-edit-tab-errors';

const resolveStoryTab = (value: string | null, tabs: NavigationPaneTab[]): string => {
  if (!value) return 'Details';
  const match = tabs.find((tab) => tab.label.toLowerCase() === value.toLowerCase());
  return match?.label ?? 'Details';
};

const props = defineProps<StoryEditProps & SharedPageProps>();
const shared = useSharedStore();
const { errors } = storeToRefs(shared);
shared.setFromProps(props);
if (Object.keys(props.errors ?? {}).length === 0) {
  shared.clearErrors();
}
useWidgetsStore().setProviders(props.providers);

const model = useModelStore();
model.setModel(props.model);

const attachedResources = ref<ResourceItem[]>([...(props.model.resources ?? [])]);
const availableResources = props.availableResources ?? [];
const isSaving = ref(false);

const attachResourceId = new URLSearchParams(window.location.search).get(
  'attachResource',
);
if (attachResourceId) {
  const resource = availableResources.find((item) => item.id === attachResourceId);
  if (resource && !attachedResources.value.some((item) => item.id === attachResourceId)) {
    attachedResources.value = [...attachedResources.value, resource];
  }
}

if (shared.isTranslation) {
  model.setSource(props.source ?? {});
}

const title = ref(props.model.title);
const sectionType = ref<string | null>(props.model.sectionType || 'Section');

model.$subscribe(() => {
  title.value = model.getField('title', 'New Story');
  sectionType.value = model.getField('sectionType', 'Section');
});

const headerSubtitle = computed(() => title.value?.trim() || 'Edit Story');

const sectionTabLabel = computed(() => `${sectionType.value ?? 'Section'}s`);

const storyEditTabs = computed((): NavigationPaneTab[] => [
  {
    label: 'Details',
    hasError: storyEditTabHasError('details', errors.value),
  },
  // TODO(sections): re-enable when spec is ready
  // {
  //   label: sectionTabLabel.value,
  //   hasError: storyEditTabHasError('sections', errors.value),
  // },
  {
    label: 'Resources',
    hasError: storyEditTabHasError('resources', errors.value),
  },
]);

const storyEditTabIcons = computed(() => ({
  Details: BookOpen,
  // TODO(sections): re-enable when spec is ready
  // [sectionTabLabel.value]: LayoutList,
  Resources: FolderClosed,
}));

const initialTabs: NavigationPaneTab[] = [
  { label: 'Details' },
  // TODO(sections): re-enable when spec is ready
  // { label: `${props.model.sectionType || 'Section'}s` },
  { label: 'Resources' },
];

const currentStoryTab = ref(
  resolveStoryTab(new URLSearchParams(window.location.search).get('tab'), initialTabs),
);

const onStoryTabChange = (tab: string) => {
  currentStoryTab.value = tab;
};

const focusFirstErroredTab = () => {
  const tab = firstStoryEditTabWithError(errors.value, sectionTabLabel.value);
  if (tab && tab !== sectionTabLabel.value) {
    currentStoryTab.value = tab;
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

const deleteStory = () => {
  router.delete(`/${shared.locale}/story/${props.model.id}`, {
    onError: (errors) => shared.addMessage(ResponseStatus.Failure, errors.other),
  });
};

const getPayload = () => ({
  title: model.getField('title', ''),
  coverImage: model.getField('coverImage', ''),
  chapterLimit: model.getField('chapterLimit', 0),
  storyType: model.getField('storyType', ''),
  chapterType: model.getField('chapterType', ''),
  sectionType: model.getField('sectionType', ''),
  tags: model.getField('tags', ''),
  description: model.getField('description', ''),
  visibility: model.getField('visibility', ''),
  sections: model.getField('sections', []),
  resources: resourceIds(attachedResources.value),
  isPublished: model.getField('isPublished', false),
});

const saveStory = () => {
  shared.clearErrors();
  isSaving.value = true;

  router.post(`/${shared.locale}/story/${props.model.id}`, getPayload(), {
    preserveScroll: true,

    onSuccess: (page) => {
      const flashError = (page.props as { flash?: { error?: string } }).flash?.error;
      if (flashError) {
        shared.addMessage(ResponseStatus.Failure, flashError);
        return;
      }
      shared.addMessage(ResponseStatus.Confirmation, 'Story saved successfully');
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
  });
};
</script>

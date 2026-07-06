<template>
  <AppLayout title="Add Story" :subtitle="headerSubtitle">
    <template #actions>
      <StudioButton
        label="Create Story"
        variant="secondary"
        :disabled="isSaving"
        @click="createStory"
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
            :is-translation="false"
            :templates="props.templates"
          />
          <StoryEditSections
            v-if="currentStoryTab === `${sectionType ?? 'Section'}s`"
            :section-type="sectionType"
            :tab-icon="currentStoryTabIcon"
          />
          <div v-if="currentStoryTab === 'Resources'" dir="ltr">
            <StoryEditResources
              v-model:resources="attachedResources"
              :available-resources="availableResources"
              :allow-create="false"
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
import { BookOpen, FolderClosed, LayoutList } from '@lucide/vue';

import type {
  NavigationPaneTab,
  ResourceItem,
  SharedPageProps,
  StoryCreateProps,
} from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore, useWidgetsStore, useModelStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import StudioButton from '../shared/studio-button.vue';
import TabNavigation from '../shared/tab-navigation.vue';
import StoryEditDetails from './components/story-edit-details.vue';
import StoryEditSections from './components/story-edit-sections.vue';
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

const props = defineProps<StoryCreateProps & SharedPageProps>();

const shared = useSharedStore();
const { errors } = storeToRefs(shared);
shared.setFromProps(props);
if (Object.keys(props.errors ?? {}).length === 0) {
  shared.clearErrors();
}
useWidgetsStore().setProviders(props.providers);

const model = useModelStore();
model.setModel(props.model);

const attachedResources = ref<ResourceItem[]>([]);
const availableResources = props.availableResources ?? [];
const isSaving = ref(false);

const title = ref(props.model.title);
const sectionType = ref<string | null>(props.model.sectionType || 'Section');

model.$subscribe(() => {
  title.value = model.getField('title', 'New Story');
  sectionType.value = model.getField('sectionType', 'Section');
});

const headerSubtitle = computed(() => title.value?.trim() || 'Create Story');

const sectionTabLabel = computed(() => `${sectionType.value ?? 'Section'}s`);

const storyEditTabs = computed((): NavigationPaneTab[] => [
  {
    label: 'Details',
    hasError: storyEditTabHasError('details', errors.value),
  },
  {
    label: sectionTabLabel.value,
    hasError: storyEditTabHasError('sections', errors.value),
  },
  {
    label: 'Resources',
    hasError: storyEditTabHasError('resources', errors.value),
  },
]);

const storyEditTabIcons = computed(() => ({
  Details: BookOpen,
  [sectionTabLabel.value]: LayoutList,
  Resources: FolderClosed,
}));

const initialSectionType = props.model.sectionType || 'Section';
const initialTabs: NavigationPaneTab[] = [
  { label: 'Details' },
  { label: `${initialSectionType}s` },
  { label: 'Resources' },
];

const currentStoryTab = ref(
  resolveStoryTab(new URLSearchParams(window.location.search).get('tab'), initialTabs),
);

const currentStoryTabIcon = computed(
  () => storyEditTabIcons.value[currentStoryTab.value],
);

const onStoryTabChange = (tab: string) => {
  currentStoryTab.value = tab;
};

const focusFirstErroredTab = () => {
  const tab = firstStoryEditTabWithError(errors.value, sectionTabLabel.value);
  if (tab) {
    currentStoryTab.value = tab;
  }
};

onMounted(() => {
  if (Object.keys(props.errors ?? {}).length > 0) {
    focusFirstErroredTab();
  }
});

const getPayload = () => {
  return {
    title: model.getField('title', ''),
    coverImage: model.getField('coverImage', ''),
    description: model.getField('description', ''),
    chapterLimit: model.getField('chapterLimit', 0),
    tags: model.getField('tags', ''),
    storyType: model.getField('storyType', ''),
    chapterType: model.getField('chapterType', ''),
    sectionType: model.getField('sectionType', ''),
    visibility: model.getField('visibility', ''),
    template: model.getField('template', ''),
    sections: model.getField('sections', []),
    resources: resourceIds(attachedResources.value),
  };
};

const createStory = () => {
  shared.clearErrors();
  isSaving.value = true;

  router.post(`/${shared.locale}/story`, getPayload(), {
    preserveScroll: true,

    onSuccess: () => {
      shared.addMessage(ResponseStatus.Confirmation, 'Story created successfully');
    },

    onError: (validationErrors) => {
      shared.setErrors(validationErrors);
      focusFirstErroredTab();
      shared.addMessage(ResponseStatus.Failure, 'Error creating story');
    },

    onFinish: () => {
      isSaving.value = false;
    },
  });
};
</script>

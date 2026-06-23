<template>
  <AppLayout>
    <template #header>
      <ContentHeader :title="title || 'New Story'">
        <template #actions>
          <ActionButton v-if="props.hasNoContent" icon="trash" @tap="deleteStory" />
          <PillButton label="Save" variant="green" @click="saveStory" />

          <PillButton
            v-if="!isPublished"
            label="Publish"
            variant="green"
            @click="publishStory"
          />
        </template>
        <template #extra-actions>
          <div class="pb-6">
            <NavigationPane
              :tabs="storyEditTabs"
              :current-tab="currentStoryTab"
              @change="onStoryTabChange"
            />
          </div>
        </template>
      </ContentHeader>
    </template>

    <section>
      <div class="relative grid grid-cols-[1fr_375px] gap-x-4">
        <form class="space-y-8">
          <StoryEditDetails
            v-if="currentStoryTab === 'Details'"
            :is-translation="shared.isTranslation"
          />
          <StoryEditSections
            v-if="currentStoryTab === `${sectionType ?? 'Section'}s`"
            :section-type="sectionType"
            :tab-icon="currentStoryTabIcon"
          />
          <StoryEditResources
            v-if="currentStoryTab === 'Resources'"
            v-model:resources="attachedResources"
            :available-resources="availableResources"
            @create="createResource"
          />
        </form>
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { router } from '@inertiajs/vue3';

import type {
  NavigationPaneTab,
  ResourceItem,
  SharedPageProps,
  StoryEditProps,
} from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore, useWidgetsStore, useModelStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import PillButton from '../shared/pill-button.vue';
import ActionButton from '../shared/action-button.vue';
import NavigationPane from '../shared/navigation-pane.vue';
import StoryEditDetails from './components/story-edit-details.vue';
import StoryEditSections from './components/story-edit-sections.vue';
import StoryEditResources from './components/story-edit-resources.vue';
import { resourceIds } from './components/resource-utils';

const props = defineProps<StoryEditProps & SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);
shared.clearErrors();
useWidgetsStore().setProviders(props.providers);

const model = useModelStore();
model.setModel(props.model);

const attachedResources = ref<ResourceItem[]>([...(props.model.resources ?? [])]);
const availableResources = props.availableResources ?? [];

const isPublished = computed(() => props.model.isPublished);

if (shared.isTranslation) {
  model.setSource(props.source ?? {});
}

const title = ref(props.model.title);
const sectionType = ref<string | null>(props.model.sectionType || 'Section');

model.$subscribe(() => {
  title.value = model.getField('title', 'New Story');
  sectionType.value = model.getField('sectionType', 'Section');
});

const storyEditTabs = computed(
  () =>
    [
      { label: 'Details', icon: 'book-open' },
      { label: `${sectionType.value ?? 'Section'}s`, icon: 'list-bullet' },
      { label: 'Resources', icon: 'folder' },
    ] as NavigationPaneTab[],
);
const currentStoryTab = ref('Details');

const currentStoryTabIcon = computed(
  () => storyEditTabs.value.find((t) => t.label === currentStoryTab.value)?.icon ?? '',
);

const onStoryTabChange = (tab: string) => {
  currentStoryTab.value = tab;
};

const createResource = () => {
  router.visit(`/${shared.locale}/resource/create`);
};

const deleteStory = () => {
  router.delete(`/${shared.locale}/story/${props.model.id}`, {
    onError: (errors) => shared.addMessage(ResponseStatus.Failure, errors.other),
  });
};

const getPayload = (forPublish: boolean = false) => {
  const askingIsPublished = forPublish ? true : model.getField('isPublished', false);
  return {
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
    isPublished: askingIsPublished,
  };
};

const publishStory = () => {
  if (isPublished.value) return;

  shared.clearErrors();
  router.post(`/${shared.locale}/story/${props.model.id}`, getPayload(true), {
    preserveScroll: true,

    onSuccess: (page) => {
      const flashError = (page.props as { flash?: { error?: string } }).flash?.error;
      if (flashError) {
        shared.addMessage(ResponseStatus.Failure, flashError);
        return;
      }
      shared.addMessage(ResponseStatus.Confirmation, 'Story published successfully!');
    },

    onError: (errors) => {
      shared.setErrors(errors);
      shared.addMessage(ResponseStatus.Failure, 'Error publishing story');
    },
  });
};

const saveStory = () => {
  shared.clearErrors();
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

    onError: (errors) => {
      shared.setErrors(errors);
      shared.addMessage(ResponseStatus.Failure, 'Error saving story');
    },
  });
};
</script>

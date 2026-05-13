<template>
  <AppLayout>
    <template #header>
      <ContentHeader :title="title || 'New Story'">
        <template #actions>
          <ActionButton icon="info" @tap="shared.setShowMetaBox(!shared.showMetaBox)" />
          <ActionButton v-if="isNew" icon="trash" @tap="deleteStory" />
          <LabelButton label="Save" @tap="saveStory" />
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
      <div
        :class="[
          'relative grid',
          {
            'grid-cols-[1fr_375px] gap-x-4': !shared.isSingleColumn,
            'mx-auto max-w-4xl grid-cols-1': shared.isSingleColumn,
          },
        ]"
      >
        <form class="space-y-8 bg-white py-4">
          <StoryEditDetails v-if="currentStoryTab === 'Details'" />
          <StoryEditSections v-if="currentStoryTab === 'Sections'" />
          <StoryEditResources v-if="currentStoryTab === 'Resources'" />
        </form>

        <ContentSidebar>
          <template #meta-box>
            <MetaMetaBox
              :story-type="story.storyType"
              :chapter-type="story.chapterType"
              :name="story.name"
              :created-at="story.createdAt"
              :updated-at="savedAt"
            />
          </template>
        </ContentSidebar>
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { DateTime } from 'luxon';
import { router } from '@inertiajs/vue3';

import type { NavigationPaneTab, SharedPageProps } from '../../types';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import { useSharedStore, useWidgetsStore, useModelStore } from '../store';
import { ResponseStatus, StoryEditProps } from '../../types';
import LabelButton from '../shared/label-button.vue';
import MetaMetaBox from './components/meta-meta-box.vue';
import ActionButton from '../shared/action-button.vue';
import ContentSidebar from '../shared/content-sidebar.vue';
import StoryEditDetails from './components/story-edit-details.vue';
import StoryEditResources from './components/story-edit-resources.vue';
import StoryEditSections from './components/story-edit-sections.vue';
import NavigationPane from '../shared/navigation-pane.vue';

const props = defineProps<StoryEditProps & SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);
shared.clearErrors();
useWidgetsStore().setProviders(props.providers);

const model = useModelStore();
model.setModel(props.story);

const title = ref(props.story.name);
const savedAt = ref(props.story.updatedAt as unknown as string);

const storyEditTabs: NavigationPaneTab[] = [
  { label: 'Details', icon: 'book-open' },
  { label: 'Sections', icon: 'list-bullet' },
  { label: 'Resources', icon: 'folder' },
];
const currentStoryTab = ref('Details');

const onStoryTabChange = (tab: string) => {
  currentStoryTab.value = tab;
};

onMounted(() => {
  model.$subscribe(() => {
    title.value = model.getField('name', 'New Story');
  });
});

const deleteStory = () => {
  router.delete(`/${shared.locale}/story/${props.story.id}`, {
    onSuccess: () => shared.addMessage(ResponseStatus.Confirmation, 'Story deleted'),
    onError: () => shared.addMessage(ResponseStatus.Failure, 'Error deleting story'),
  });
};

const getPayload = () => {
  return {
    name: model.getField('name', ''),
    coverImage: model.getField('coverImage', ''),
    chapterLimit: model.getField('chapterLimit', 0),
    tags: model.getField('tags', ''),
    description: model.getField('description', ''),
  };
};

const saveStory = () => {
  shared.clearErrors();

  router.post(`/${shared.locale}/story/${props.story.id}`, getPayload(), {
    preserveScroll: true,

    onSuccess: () => {
      savedAt.value = DateTime.now().toISO() ?? '';
      shared.addMessage(ResponseStatus.Confirmation, 'Story saved successfully');
    },

    onError: (errors) => {
      shared.setErrors(errors);
      shared.addMessage(ResponseStatus.Failure, 'Error saving story');
    },
  });
};
</script>

<template>
  <AppLayout>
    <template #header>
      <ContentHeader :title="title || 'New Story'">
        <template #actions>
          <ActionButton icon="info" @tap="shared.setShowMetaBox(!shared.showMetaBox)" />
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
        <form class="space-y-8">
          <StoryEditDetails
            v-if="currentStoryTab === 'Details'"
            :tab-icon="currentStoryTabIcon"
          />
          <StoryEditSections
            v-if="currentStoryTab === 'Sections'"
            :tab-icon="currentStoryTabIcon"
          />
          <StoryEditResources
            v-if="currentStoryTab === 'Resources'"
            v-model:resources="attachedResources"
            :available-resources="availableResources"
            @create="createResource"
          />
        </form>

        <ContentSidebar>
          <template #meta-box>
            <MetaMetaBox
              :story-type="model.storyType"
              :chapter-type="model.chapterType"
              :created-at="createdAt"
              :updated-at="savedAt"
            />
          </template>
        </ContentSidebar>
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from 'vue';
import { DateTime } from 'luxon';
import { router } from '@inertiajs/vue3';

import type { NavigationPaneTab, Resource, SharedPageProps, StoryEditProps } from '../../types';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import { useSharedStore, useWidgetsStore, useModelStore } from '../store';
import { ResponseStatus } from '../../types';
import LabelButton from '../shared/label-button.vue';
import MetaMetaBox from './components/meta-meta-box.vue';
import ActionButton from '../shared/action-button.vue';
import ContentSidebar from '../shared/content-sidebar.vue';
import StoryEditDetails from './components/story-edit-details.vue';
import StoryEditResources from './components/story-edit-resources.vue';
import StoryEditSections from './components/story-edit-sections.vue';
import NavigationPane from '../shared/navigation-pane.vue';
import { resourceIds } from './components/resource-utils';

const props = defineProps<StoryEditProps & SharedPageProps>();
const { model, availableResources } = toRefs(props);

const shared = useSharedStore();
shared.setFromProps(props);
shared.clearErrors();
useWidgetsStore().setProviders(props.providers);

const storyModel = useModelStore();
storyModel.setModel(model.value);

const title = ref(model.value.title);
const savedAt = ref(DateTime.now().toISO() ?? '');
const createdAt = ref(DateTime.now().toISO() ?? '');
const attachedResources = ref<Resource[]>([...(model.value.resources ?? [])]);

const storyEditTabs: NavigationPaneTab[] = [
  { label: 'Details', icon: 'book-open' },
  { label: 'Sections', icon: 'list-bullet' },
  { label: 'Resources', icon: 'folder' },
];
const currentStoryTab = ref('Details');

const currentStoryTabIcon = computed(
  () => storyEditTabs.find((t) => t.label === currentStoryTab.value)?.icon ?? '',
);

const onStoryTabChange = (tab: string) => {
  currentStoryTab.value = tab;
};

onMounted(() => {
  storyModel.$subscribe(() => {
    title.value = storyModel.getField('title', 'New Story') as string;
  });
});

const createResource = () => {
  router.visit(`/${shared.locale}/resource/create`);
};

const getPayload = () => ({
  resourceIds: resourceIds(attachedResources.value),
});

const saveStory = () => {
  shared.clearErrors();

  router.post(`/${shared.locale}/story/${model.value.id}`, getPayload(), {
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

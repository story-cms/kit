<template>
  <AppLayout :title="layoutTitle" :subtitle="layoutSubtitle">
    <template #actions>
      <DraftEditActions
        :has-edit-review="props.hasEditReview"
        @delete="deleteDraft"
        @publish="publishDraft"
        @request-change="rejectDraft"
        @submit="submitDraft"
      />
    </template>
    <template #controls>
      <div v-if="props.isTranslation" class="flex flex-col items-start gap-4">
        <TabNavigation
          :tabs="tabs"
          :icons="tabIcons"
          :current-tab="currentTab"
          @change="onTabChange"
        />

        <nav class="w-full" aria-label="Language columns">
          <div class="flex flex-wrap justify-between gap-2">
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
      </div>
      <TabNavigation
        v-else
        :tabs="tabs"
        :icons="tabIcons"
        :current-tab="currentTab"
        @change="onTabChange"
      />
    </template>
    <template #main>
      <div
        :class="[
          'relative',
          {
            'grid min-h-screen': props.isTranslation,
            'grid-cols-[1fr_375px] gap-x-4':
              props.isTranslation && !shared.isSingleColumn,
            'mx-auto grid-cols-1':
              props.isTranslation && shared.isSingleColumn && !shared.showSourceColumn,
          },
        ]"
      >
        <div
          ref="sourceSection"
          :class="{ 'subgrid row-[span_1000]': props.isTranslation }"
        >
          <form
            :dir="shared.isRtl ? 'rtl' : 'ltr'"
            :class="{ 'subgrid row-[span_1000] gap-y-4': props.isTranslation }"
          >
            <slot v-if="currentTab === 'Details'" name="details" />
            <div v-if="currentTab === 'Blocks'" dir="ltr">
              <slot name="blocks" :blocks="blocks" :update-blocks="updateBlocks" />
            </div>
            <div v-if="currentTab === 'Resources'" dir="ltr">
              <StoryEditResources
                v-model:resources="attachedResources"
                :available-resources="availableResources"
                @create="createResource"
              />
            </div>
          </form>
        </div>

        <ContentSidebar
          v-if="props.isTranslation"
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
                :bundle="previewBundle"
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
import { ref, type VNode } from 'vue';
import { Blocks, BookOpen, Eye, EyeOff, FolderClosed } from '@lucide/vue';

import type { ChapterBlock } from '../../../types';
import { formatDate } from '../../shared/helpers';
import AppLayout from '../../shared/app-layout.vue';
import ContentSidebar from '../../shared/content-sidebar.vue';
import MetaBox from '../../shared/meta-box.vue';
import MobileAppPreview from '../../shared/mobile-app-preview.vue';
import TabButton from '../../shared/tab-button.vue';
import TabNavigation from '../../shared/tab-navigation.vue';
import { useTranslationDraftLayout } from '../use-translation-draft-layout';
import type { ChapterDraftEditProps } from '../../../types';
import { useChapterDraftEdit } from '../use-chapter-draft-edit';
import DraftEditActions from './draft-edit-actions.vue';
import StoryEditResources from './story-edit-resources.vue';

const props = withDefaults(
  defineProps<ChapterDraftEditProps & { isTranslation?: boolean }>(),
  {
    isTranslation: false,
  },
);

defineSlots<{
  details: () => VNode[];
  blocks: (props: {
    blocks: ChapterBlock[];
    updateBlocks: (blocks: ChapterBlock[]) => void;
  }) => VNode[];
}>();

const {
  attachedResources,
  availableResources,
  blocks,
  createResource,
  currentTab,
  deleteDraft,
  layoutSubtitle,
  layoutTitle,
  metaChapter,
  onTabChange,
  previewBundle,
  publishDraft,
  publishedWhen,
  rejectDraft,
  shared,
  submitDraft,
  tabs,
  updateBlocks,
} = useChapterDraftEdit(props, props.isTranslation);

const tabIcons = {
  Details: BookOpen,
  Blocks,
  Resources: FolderClosed,
};

const sourceSection = ref<HTMLElement | null>(null);
const { sourceLanguageName, marginRight } = useTranslationDraftLayout(
  sourceSection,
  props.isTranslation,
);
</script>

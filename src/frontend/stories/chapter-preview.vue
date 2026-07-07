<template>
  <AppLayout title="Story" :subtitle="chapterTitle">
    <template #actions>
      <DraftActions :can-delete="false" />
      <StudioButton label="Edit" variant="blue" @click="editChapter" />
    </template>
    <template #main>
      <div
        :class="[
          'relative grid',
          {
            'grid-cols-[1fr_375px] gap-x-4': !shared.isSingleColumn,
            'mx-auto grid-cols-1': shared.isSingleColumn,
          },
        ]"
      >
        <!-- eslint-disable vue/no-v-html -->
        <div class="form-panel" v-html="bundleView"></div>
        <ContentSidebar>
          <template #meta-box>
            <MetaBox
              :primary="[
                { label: story.storyType, value: story.name },
                { label: story.chapterType, value: metaChapter },
              ]"
              :secondary="[
                { label: 'Created', value: formatDate(chapter.createdAt) },
                { label: 'Auto-Saved', value: formatDate(chapter.updatedAt) },
                { label: 'Last Published', value: publishedWhen },
              ]"
            />
          </template>
          <template #app-preview>
            <div v-if="shared.config.hasAppPreview">
              <MobileAppPreview
                v-if="bundle"
                :bundle="bundle"
                :number="chapter.number"
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
import { computed, onMounted } from 'vue';
import { router } from '@inertiajs/vue3';

import type { PreviewProps, SharedPageProps } from '../../types';
import DraftActions from '../shared/draft-actions.vue';
import StudioButton from '../shared/studio-button.vue';
import MobileAppPreview from '../shared/mobile-app-preview.vue';
import AppLayout from '../shared/app-layout.vue';
import ContentSidebar from '../shared/content-sidebar.vue';
import { formatDate, padZero, safeChapterTitle } from '../shared/helpers';
import MetaBox from '../shared/meta-box.vue';
import { useSharedStore } from '../store';

const props = defineProps<PreviewProps & SharedPageProps>();

const shared = useSharedStore();
shared.setFromProps(props);

const chapterTitle =
  safeChapterTitle(props.title, props.story.name, props.chapter.number) ??
  `New ${props.story.chapterType}`;

const publishedWhen = computed(() => {
  return props.chapter.updatedAt === ''
    ? 'Unpublished'
    : formatDate(props.chapter.updatedAt);
});

const metaChapter = computed(
  () => `${padZero(props.chapter.number)} of ${padZero(props.story.chapterLimit)}`,
);

const editChapter = () => {
  router.visit(
    `/${shared.locale}/story/${props.story.id}/draft/${props.chapter.number}/edit`,
  );
};

onMounted(() => {
  shared.setSourceColumnAsHidden(false);
});
</script>

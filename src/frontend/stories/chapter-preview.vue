<template>
  <AppLayout>
    <template #header>
      <ContentHeader :title="chapterTitle">
        <template #actions>
          <DraftActions :can-delete="false" />
          <Link
            class="w-32 rounded-[38px] border border-blue-500 bg-blue-500 px-[15px] py-[9px] text-center text-sm/5 font-medium text-white shadow"
            :href="`/${shared.locale}/story/${story.id}/draft/${chapter.number}/edit`"
          >
            Edit
          </Link>
        </template>
      </ContentHeader>
    </template>

    <div
      :class="[
        'relative grid',
        {
          'grid-cols-[1fr_375px] gap-x-4': !shared.isSingleColumn,
          'mx-auto max-w-4xl grid-cols-1': shared.isSingleColumn,
        },
      ]"
    >
      <!-- eslint-disable vue/no-v-html -->
      <div class="bg-white p-8 shadow-sm" v-html="bundleView"></div>
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
          <div v-if="shared.meta.hasAppPreview">
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
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { Link } from '@inertiajs/vue3';

import type { PreviewProps, SharedPageProps } from '../../types';
import DraftActions from '../shared/draft-actions.vue';
import MobileAppPreview from '../shared/mobile-app-preview.vue';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
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

onMounted(() => {
  shared.setSourceColumnAsHidden(false);
});
</script>

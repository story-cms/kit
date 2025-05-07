<template>
  <AppLayout>
    <template #header>
      <ContentHeader :title="chapterTitle">
        <template #draft-actions>
          <DraftActions :can-delete="false" />
          <button
            type="button"
            class="w-32 rounded-[38px] border border-blue-500 bg-blue-500 px-[15px] py-[9px] text-sm/5 font-medium text-white shadow"
            @click.prevent="edit"
          >
            Edit
          </button>
        </template>
      </ContentHeader>
    </template>

    <div
      :class="[
        'relative grid',
        {
          'grid-cols-[1fr_375px] gap-x-4': !drafts.isSingleColumn,
          'mx-auto max-w-4xl grid-cols-1': drafts.isSingleColumn,
        },
      ]"
    >
      <!-- eslint-disable vue/no-v-html -->
      <div class="p-8 bg-white shadow-sm" v-html="bundleView"></div>
      <ContentSidebar>
        <template #meta-box>
          <MetaBox
            :created-at="props.chapter.createdAt"
            :updated-at="props.chapter.updatedAt"
            :story-type="props.meta.storyType"
            :chapter-type="metaChapter"
            :published-when="publishedWhen"
          />
        </template>
        <template #app-preview>
          <div v-if="shared.meta.hasAppPreview">
            <MobileAppPreview
              v-if="bundle"
              :bundle="bundle"
              :number="props.chapter.number"
              class="mt-2"
            />
          </div>
        </template>
      </ContentSidebar>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import DraftActions from '../fields/draft-actions.vue';
import MetaBox from '../shared/meta-box.vue';
import ContentSidebar from '../shared/content-sidebar.vue';
import MobileAppPreview from '../fields/mobile-app-preview.vue';
import { formatDate, padZero, safeChapterTitle } from '../shared/helpers';
import type { PreviewProps, SharedPageProps } from '../../types';
import { useSharedStore, useDraftsStore } from '../store';

const props = defineProps<PreviewProps & SharedPageProps>();

const shared = useSharedStore();
const drafts = useDraftsStore();
shared.setFromProps(props);

const chapterTitle =
  safeChapterTitle(props.title, props.storyName, props.chapter.number) ??
  `New ${props.meta.chapterType}`;

const showMetaBox = ref(true);
const showAppPreview = ref(true);

const isLargeScreen = computed(() => {
  return shared.isLargeScreen;
});

watch([showMetaBox, showAppPreview, isLargeScreen], ([a, b, c]) => {
  if (c) {
    showMetaBox.value = a;
    showAppPreview.value = b;
  }
});

const publishedWhen = computed(() => {
  return props.chapter.updatedAt === ''
    ? 'Unpublished'
    : formatDate(props.chapter.updatedAt);
});

const metaChapter = computed(
  () => `${padZero(props.chapter.number)} of ${padZero(props.chapterLimit)}`,
);

const edit = () => {
  window.location.href = `/draft/${props.chapter.number}/edit`;
};
</script>

<template>
  <AppLayout>
    <template #header>
      <ContentHeader :title="chapterTitle">
        <template #draft-actions>
          <DraftActions @delete="deleteDraft" />
        </template>
        <template #workflow-actions>
          <WorkflowActions @publish="publish" @request-change="reject" @submit="submit" />
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
      <form :dir="shared.isRtl ? 'rtl' : 'ltr'" class="space-y-8">
        <div v-for="(item, index) in drafts.story.fields" :key="index">
          <component :is="widgetFor(index)" :field="item" :is-nested="false" />
        </div>
      </form>
      <ContentSidebar>
        <template #meta-box>
          <MetaBox
            :created-at="props.draft.createdAt"
            :updated-at="props.draft.updatedAt"
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
              :number="props.draft.number"
              class="mt-2"
            />
          </div>
        </template>
      </ContentSidebar>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import AppLayout from '../shared/app-layout.vue';

import { router } from '@inertiajs/vue3';
import type { Errors } from '@inertiajs/core';
import { padZero, debounce, formatDate, safeChapterTitle } from '../shared/helpers';
import type { FieldSpec, DraftEditProps, SharedPageProps } from '../../types';
import { ResponseStatus } from '../../types';
import { useDraftsStore, useModelStore, useSharedStore, useWidgetsStore } from '../store';
import ContentHeader from '../shared/content-header.vue';
import DraftActions from './draft-actions.vue';
import WorkflowActions from './workflow-actions.vue';
import ContentSidebar from '../shared/content-sidebar.vue';
import MetaBox from '../shared/meta-box.vue';
import MobileAppPreview from './mobile-app-preview.vue';

const props = defineProps<DraftEditProps & SharedPageProps>();

const model = useModelStore();
model.setFromProps(props);
const shared = useSharedStore();
shared.setFromProps(props);
const drafts = useDraftsStore();
drafts.setFromProps(props);
const widgets = useWidgetsStore();
widgets.setProviders(props.providers);

let isSettingErrors = false;

type postType = { feedback: string | undefined; bundle: any };

const getPayload = (): postType => {
  return {
    feedback: '',
    bundle: model.model,
  };
};

const defaultTitle = computed(() => {
  return `New ${props.meta.chapterType}`;
});

const title = ref(props.bundle.title);

const chapterTitle = computed(() => {
  if (title.value === defaultTitle.value) return defaultTitle.value;
  return (
    safeChapterTitle(title.value, props.storyName, props.draft.number) ??
    defaultTitle.value
  );
});

// actions
const onSuccess = (message?: string) => {
  widgets.setIsDirty(false);
  if (!message) return;

  shared.addMessage(ResponseStatus.Confirmation, message);
};

const onError = (_errors: Errors, message: string) => {
  widgets.setIsDirty(false);
  isSettingErrors = true;
  shared.setErrors(props.errors);
  shared.addMessage(ResponseStatus.Failure, message);
};

const save = debounce(2000, () => {
  router.post(`/draft/${props.draft.id}/save`, getPayload(), {
    preserveScroll: true,
    onSuccess: () => {
      onSuccess();
      if (props.user.role === 'admin') return;
      drafts.setStatus('started');
    },
    onError: (e) => onError(e, `${props.meta.chapterType} not saved`),
  });
});

const deleteDraft = () => {
  router.delete(`/draft/${props.draft.id}`, {
    onSuccess: () => onSuccess('Draft successfully deleted'),
    onError: (e) => onError(e, 'Error deleting draft'),
  });
};

const submit = () => {
  router.post(`/draft/${props.draft.id}/submit`, getPayload(), {
    onSuccess: () => onSuccess(`${props.meta.chapterType} submitted for review`),
    onError: (e) =>
      onError(e, 'Draft not submitted. Please review and correct any errors.'),
  });
};

const publish = () => {
  widgets.setIsDirty(true);
  router.post(`/draft/${props.draft.id}/publish`, getPayload(), {
    onSuccess: () => onSuccess(`${props.meta.chapterType} published successfully`),
    onError: (e) =>
      onError(
        e,
        `${props.meta.chapterType} not published. Please review and correct any errors.`,
      ),
  });
};

const reject = () => {
  router.post(`/draft/${props.draft.id}/reject`, getPayload(), {
    onSuccess: () => onSuccess('Draft sent back for fixing'),
    onError: (e) => onError(e, 'Error sending draft back'),
  });
};

const publishedWhen = computed(() => {
  return props.lastPublished == '' ? 'Unpublished' : formatDate(props.lastPublished);
});

const metaChapter = computed(
  () => `${padZero(props.draft.number)} of ${padZero(props.spec.chapterLimit)}`,
);

const handleResponsiveLayout = () => {
  if (shared.isLargeScreen) {
    drafts.setSingleColumn(false);
  }
  if (!shared.isLargeScreen) {
    drafts.setSingleColumn(true);
  }
};

watch(
  () => shared.isLargeScreen,
  () => handleResponsiveLayout(),
);

onMounted(() => {
  model.$subscribe(() => {
    if (isSettingErrors) {
      isSettingErrors = false;
      return;
    }
    widgets.setIsDirty(true);
    save();
    title.value = model.getField('title', defaultTitle.value);
  });

  handleResponsiveLayout();
  shared.setCurrentStoryName(props.storyName);
});

const widgetFor = (key: number) => {
  const widget = (props.spec.fields as FieldSpec[])[key].widget;
  return widgets.picker(widget);
};
</script>

<template>
  <AppLayout>
    <template #header>
      <ContentHeader :title="chapterTitle">
        <template #actions>
          <DraftActions @delete="deleteDraft" />
          <WorkflowActions
            @request-change="reject"
            @publish="publishDraft"
            @submit="submitDraft"
          />
        </template>
        <template #extra-actions>
          <div
            class="flex items-center justify-between py-4 text-sm font-medium leading-4"
          >
            <p class="text-left">{{ shared.language.language }}</p>
            <p class="inline-flex items-center justify-end">
              English
              <button
                class="ml-2"
                @click="shared.setSourceColumnAsHidden(!shared.showSourceColumn)"
              >
                <Icon name="eyeoff" class="block text-black cursor-pointer size-6" />
              </button>
            </p>
          </div>
        </template>
      </ContentHeader>
    </template>
    <div
      :class="[
        'relative grid min-h-screen',
        {
          'grid-cols-[1fr_375px] gap-x-4': !shared.isSingleColumn,
          'mx-auto max-w-4xl grid-cols-1':
            shared.isSingleColumn && !shared.showSourceColumn,
        },
      ]"
    >
      <div
        :class="[
          'grid h-full grid-flow-col-dense',
          {
            'grid-cols-[repeat(2,_minmax(440px,_1fr))] gap-x-2 overflow-x-auto':
              shared.showSourceColumn && !shared.isLargeScreen,
            'grid-cols-2 gap-x-2 overflow-x-auto':
              shared.showSourceColumn && shared.isLargeScreen,
            'grid-cols-1': !shared.showSourceColumn,
          },
        ]"
      >
        <section class="row-subgrid">
          <form :dir="shared.isRtl ? 'rtl' : 'ltr'" class="row-subgrid gap-y-8">
            <div
              v-for="(item, index) in spec.fields"
              :key="index"
              class="grid grid-rows-[subgrid]"
              :style="{
                gridRow: `span ${
                  sourceItemsLength.find(
                    (obj: SourceItem) => obj.key === `${(item as FieldSpec).name}`,
                  )?.length
                }`,
              }"
            >
              <component :is="widgetFor(index)" :field="item" :is-nested="false" />
            </div>
          </form>
        </section>
        <section :class="['row-subgrid', { hidden: !shared.showSourceColumn }]">
          <div dir="ltr" class="row-subgrid gap-y-8">
            <div
              v-for="(item, index) in spec.fields"
              :key="index"
              class="grid grid-rows-[subgrid]"
              :style="{
                gridRow: `span ${
                  sourceItemsLength.find(
                    (obj: SourceItem) => obj.key === `${(item as FieldSpec).name}`,
                  )?.length
                }`,
              }"
            >
              <component
                :is="widgetFor(index)"
                :field="item"
                :is-nested="false"
                :is-read-only="true"
              />
            </div>
          </div>
        </section>
      </div>
      <ContentSidebar
        :is-complex-layout="true"
        :style="{ marginRight: `${marginRight}px` }"
      >
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
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { router } from '@inertiajs/vue3';
import type { Errors } from '@inertiajs/core';
import type { FieldSpec, DraftEditProps, SharedPageProps } from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore, useModelStore, useWidgetsStore, useDraftsStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import DraftActions from '../fields/draft-actions.vue';
import WorkflowActions from '../fields/workflow-actions.vue';
import Icon from '../shared/icon.vue';
import ContentSidebar from '../shared/content-sidebar.vue';
import MetaBox from '../shared/meta-box.vue';
import MobileAppPreview from './mobile-app-preview.vue';
import { debounce, padZero, formatDate, safeChapterTitle } from '../shared/helpers';

const props = defineProps<DraftEditProps & SharedPageProps>();

// state
useSharedStore().setFromProps(props);
useModelStore().setFromProps(props);
const drafts = useDraftsStore();
drafts.setFromProps(props);

const widgets = useWidgetsStore();
widgets.setProviders(props.providers);
const shared = useSharedStore();
const model = useModelStore();

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

const widgetFor = (key: number) => {
  const widget = (props.spec.fields as FieldSpec[])[key].widget;
  return widgets.picker(widget);
};

const metaChapter = computed(
  () => `${padZero(props.draft.number)} of ${padZero(props.spec.chapterLimit)}`,
);

const publishedWhen = computed(() => {
  return props.lastPublished === '' ? 'Unpublished' : formatDate(props.lastPublished);
});

const getPayload = () => {
  return {
    feedback: '',
    bundle: model.model,
  };
};

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

const deleteDraft = () => {
  router.delete(`/draft/${props.draft.id}`, {
    onSuccess: () => onSuccess('Draft successfully deleted'),
    onError: (e) => onError(e, 'Error deleting draft'),
  });
};

let isSettingErrors = false;

const saveDraft = debounce(2000, () => {
  router.post(`/draft/${props.draft.id}/save`, getPayload(), {
    preserveScroll: true,
    onSuccess: () => {
      onSuccess();
      if (props.user.role === 'admin') return;
      drafts.setStatus('started');
    },
    onError: (e) => onError(e, 'Error saving draft.'),
  });
});

const submitDraft = () => {
  router.post(`/draft/${props.draft.id}/submit`, getPayload(), {
    preserveScroll: true,
    onSuccess: () => onSuccess(`${props.meta.chapterType} submitted for review`),
    onError: (e) =>
      onError(e, 'Draft not submitted. Please review and correct any errors.'),
  });
};

const publishDraft = () => {
  widgets.setIsDirty(true);

  router.post(`/draft/${props.draft.id}/publish`, getPayload(), {
    preserveScroll: true,
    onSuccess: () => onSuccess('Draft successfully published.'),
    onError: (e) =>
      onError(e, 'Draft not published. Please review and correct any errors.'),
  });
};

const reject = () => {
  router.post(`/draft/${props.draft.id}/reject`, getPayload(), {
    preserveScroll: true,
    onSuccess: () => onSuccess('Draft sent back for fixing.'),
    onError: (e) => onError(e, 'Draft could not be sent back.'),
  });
};

interface SourceItem {
  key: string;
  length: number;
}

let sourceItemsLength: SourceItem[] = [];

interface NestedObject {
  [key: string]: string | string[] | NestedObject;
}

const getSourceItemsLength = (obj: NestedObject): SourceItem[] => {
  const result: SourceItem[] = [];

  function calculateLength(value: string | string[] | NestedObject): number {
    if (Array.isArray(value)) {
      return value.length;
    } else if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length;
    } else {
      return 1;
    }
  }
  for (const key in obj) {
    const value = obj[key];
    const length = calculateLength(value);
    result.push({ key, length });
  }
  return result;
};

sourceItemsLength = getSourceItemsLength(model.source);

const marginRight = computed(() => {
  if (shared.isLargeScreen && shared.hasOpenSidebar) {
    return (shared.layoutWidth - shared.headerWidth - 264) / 2 - 12;
  }
  if (shared.isLargeScreen && !shared.hasOpenSidebar) {
    return (shared.layoutWidth - shared.headerWidth - 84) / 2 - 12;
  }
  return 0;
});

onMounted(() => {
  model.$subscribe(() => {
    if (isSettingErrors) {
      isSettingErrors = false;
      return;
    }
    widgets.setIsDirty(true);
    title.value = model.getField('title', defaultTitle.value);
    saveDraft();
  });

  shared.setSingleColumn(true);
  shared.setShowMetaBox(false);
  if (shared.meta.hasAppPreview) {
    shared.setShowAppPreview(false);
  }
});
onUnmounted(() => {
  shared.setSingleColumn(false);
  shared.setShowMetaBox(true);
  if (shared.meta.hasAppPreview) {
    shared.setShowAppPreview(true);
  }
});
</script>

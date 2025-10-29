<template>
  <AppLayout>
    <template #header>
      <ContentHeader :title="chapterTitle">
        <template #actions>
          <DraftActions @delete="deleteDraft" />
          <WorkflowActions
            :has-edit-review="hasEditReview"
            @publish="publishDraft"
            @request-change="reject"
            @submit="submitDraft"
          />
        </template>
        <template #extra-actions>
          <div
            class="flex items-center justify-between py-4 text-sm font-medium leading-4"
          >
            <p class="text-left">{{ shared.language.language }}</p>
            <p class="inline-flex items-center justify-end">
              English ({{ sourceLength }})
              <button
                class="ml-2"
                @click="shared.setSourceColumnAsHidden(!shared.showSourceColumn)"
              >
                <Icon name="eyeoff" class="block size-6 cursor-pointer text-black" />
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
        <section
          class="grid grid-rows-subgrid"
          :style="{ gridRow: `span ${Object.keys(model.source).length}` }"
        >
          <form
            :dir="shared.isRtl ? 'rtl' : 'ltr'"
            class="grid grid-rows-subgrid"
            :style="{ gridRow: `span ${Object.keys(model.source).length}` }"
          >
            <div
              v-for="(item, index) in story.fields"
              :key="index"
              :data-index="index"
              :data-can-fold="item.canFold ? 'true' : 'false'"
              :data-in-item="item.label"
            >
              <component :is="widgetFor(index)" :field="item" :is-nested="false" />
            </div>
          </form>
        </section>
        <section
          :class="['grid grid-rows-subgrid', { hidden: !shared.showSourceColumn }]"
          :style="{ gridRow: `span ${Object.keys(model.source).length}` }"
        >
          <div
            dir="ltr"
            class="grid grid-rows-subgrid"
            :style="{ gridRow: `span ${Object.keys(model.source).length}` }"
          >
            <div
              v-for="(item, index) in story.fields"
              :key="index"
              :data-index="index"
              :data-can-fold="item.canFold ? 'true' : 'false'"
              :data-in-item="item.widget"
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
            :primary="[
              { label: story.storyType, value: story.name },
              { label: story.chapterType, value: metaChapter },
            ]"
            :secondary="[
              { label: 'Created', value: formatDate(draft.createdAt) },
              { label: 'Auto-Saved', value: formatDate(draft.updatedAt) },
              { label: 'Last Published', value: publishedWhen },
            ]"
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
import DraftActions from '../shared/draft-actions.vue';
import WorkflowActions from './components/workflow-actions.vue';
import Icon from '../shared/icon.vue';
import ContentSidebar from '../shared/content-sidebar.vue';
import MetaBox from '../shared/meta-box.vue';
import MobileAppPreview from '../shared/mobile-app-preview.vue';
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
  return `New ${props.story.chapterType}`;
});

const title = ref(props.bundle.title);

const chapterTitle = computed(() => {
  if (title.value === defaultTitle.value) return defaultTitle.value;
  return (
    safeChapterTitle(title.value, props.story.name, props.draft.number) ??
    defaultTitle.value
  );
});

const widgetFor = (key: number) => {
  const widget = (props.story.fields as FieldSpec[])[key].widget;
  return widgets.picker(widget);
};

const metaChapter = computed(
  () => `${padZero(props.draft.number)} of ${padZero(props.story.chapterLimit)}`,
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
  router.delete(`/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}`, {
    onSuccess: () => onSuccess('Draft successfully deleted'),
    onError: (e) => onError(e, 'Error deleting draft'),
  });
};

let isSettingErrors = false;

const saveDraft = debounce(2000, () => {
  router.post(
    `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/save`,
    getPayload(),
    {
      preserveScroll: true,
      onSuccess: () => {
        onSuccess();
        if (props.user.role === 'admin') return;
        drafts.setStatus('started');
      },
      onError: (e) => onError(e, 'Error saving draft.'),
    },
  );
});

const submitDraft = () => {
  router.post(
    `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/submit`,
    getPayload(),
    {
      preserveScroll: true,
      onSuccess: () => onSuccess(`${props.story.chapterType} submitted for review`),
      onError: (e) =>
        onError(e, 'Draft not submitted. Please review and correct any errors.'),
    },
  );
};

const publishDraft = () => {
  widgets.setIsDirty(true);

  router.post(
    `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/publish`,
    getPayload(),
    {
      preserveScroll: true,
      onSuccess: () => onSuccess('Draft successfully published.'),
      onError: (e) =>
        onError(e, 'Draft not published. Please review and correct any errors.'),
    },
  );
};

const reject = () => {
  router.post(
    `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/reject`,
    getPayload(),
    {
      preserveScroll: true,
      onSuccess: () => onSuccess('Draft sent back for fixing.'),
      onError: (e) => onError(e, 'Draft could not be sent back.'),
    },
  );
};

const marginRight = computed(() => {
  if (shared.isLargeScreen && shared.hasOpenSidebar) {
    return (shared.layoutWidth - shared.headerWidth - 264) / 2 - 12;
  }
  if (shared.isLargeScreen && !shared.hasOpenSidebar) {
    return (shared.layoutWidth - shared.headerWidth - 84) / 2 - 12;
  }
  return 0;
});

const sourceLength = ref(0);

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

  sourceLength.value = Object.keys(model.source).length;
});
onUnmounted(() => {
  shared.setSingleColumn(false);
  shared.setShowMetaBox(true);
  if (shared.meta.hasAppPreview) {
    shared.setShowAppPreview(true);
  }
});
</script>

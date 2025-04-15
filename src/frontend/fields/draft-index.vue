<template>
  <AppLayout>
    <ContentHeader
      :title="chapterTitle"
      @delete="deleteDraft"
      @info="info"
      @app-preview="appPreview"
    >
      <template #actions>
        <WorkflowButtons @publish="publish" @request-change="reject" @submit="submit" />
      </template>
    </ContentHeader>

    <div
      class="relative grid"
      :class="{
        'grid-cols-[1fr_360px] gap-x-10':
          isLargeScreen && (showMetaBox || showAppPreview),
        'mx-auto max-w-5xl grid-cols-1':
          !isLargeScreen || (!showMetaBox && !showAppPreview),
      }"
    >
      <form :dir="shared.isRtl ? 'rtl' : 'ltr'" class="space-y-8">
        <div v-for="(item, index) in drafts.story.fields" :key="index">
          <component :is="widgetFor(index)" :field="item" :is-nested="false" />
        </div>
      </form>
      <div
        :class="{
          'right-4': !isLargeScreen,
          'absolute block': shared.isIntersecting,
          'fixed right-4 top-24': !shared.isIntersecting && !isLargeScreen,
          'sticky top-24 [align-self:start]': isLargeScreen,
        }"
      >
        <section v-if="showMetaBox">
          <MetaBox
            :created-at="props.draft.createdAt"
            :updated-at="props.draft.updatedAt"
            :story-type="props.meta.storyType"
            :chapter-type="metaChapter"
            :published-when="publishedWhen"
            :is-floating="!isLargeScreen"
            @close="showMetaBox = false"
          />
        </section>
        <section v-if="meta.hasAppPreview && showAppPreview" class="mt-6">
          <MobileAppPreview
            v-if="bundle"
            :is-floating="!isLargeScreen"
            :bundle="bundle"
            :number="props.draft.number"
            class="mt-2"
            @close="showAppPreview = false"
          />
        </section>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import WorkflowButtons from '../fields/workflow-buttons.vue';
import MetaBox from '../shared/meta-box.vue';
import { router } from '@inertiajs/vue3';
import type { Errors } from '@inertiajs/core';
import { padZero, debounce, formatDate, safeChapterTitle } from '../shared/helpers';
import type { FieldSpec, DraftEditProps, SharedPageProps } from '../../types';
import { ResponseStatus } from '../../types';
import { useDraftsStore, useModelStore, useSharedStore, useWidgetsStore } from '../store';
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

const onError = (errors: Errors, message: string) => {
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

const info = () => {
  showMetaBox.value = !showMetaBox.value;
};

const appPreview = () => {
  showAppPreview.value = !showAppPreview.value;
};

const publishedWhen = computed(() => {
  return props.lastPublished == '' ? 'Unpublished' : formatDate(props.lastPublished);
});

const metaChapter = computed(
  () => `${padZero(props.draft.number)} of ${padZero(props.spec.chapterLimit)}`,
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
    console.info('title', title.value);
  });
});

const widgetFor = (key: number) => {
  const widget = (props.spec.fields as FieldSpec[])[key].widget;
  return widgets.picker(widget);
};
</script>

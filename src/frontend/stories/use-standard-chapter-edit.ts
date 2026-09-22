import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { router } from '@inertiajs/vue3';
import type { Errors } from '@inertiajs/core';
import axios from 'axios';

import type {
  ChapterBlock,
  StandardChapterEditProps,
  DraftEditProps,
  NavigationPaneTab,
  ResourceItem,
  SharedPageProps,
} from '../../types';
import { ResponseStatus } from '../../types';
import { formatDate, padZero, safeChapterTitle } from '../shared/helpers';
import {
  useDraftsStore,
  useModelStore,
  useSharedStore,
  useTranslationTrackerStore,
  useWidgetsStore,
} from '../store';
import {
  standardChapterEditTabHasError,
  firstStandardChapterEditTabWithError,
} from './standard-chapter-edit-tab-errors';
import {
  buildStandardChapterPayload,
  createAutosaveScheduler,
  findStandardChapterTab,
  withAttachedResource,
} from './standard-chapter-edit-controller';
import { normalizedBlocks } from './components/blocks/block-utils';

export function useStandardChapterEdit(
  props: StandardChapterEditProps & SharedPageProps,
  isTranslation: boolean,
) {
  const shared = useSharedStore();
  const { errors } = storeToRefs(shared);
  shared.setFromProps(props);
  if (Object.keys(props.errors ?? {}).length === 0) {
    shared.clearErrors();
  }

  const widgets = useWidgetsStore();
  widgets.setProviders(props.providers);

  const drafts = useDraftsStore();
  drafts.setFromProps(props as DraftEditProps);

  watch(
    () => props.draft.updatedAt,
    (updatedAt) => drafts.setUpdatedAt(updatedAt),
    { immediate: true },
  );

  const model = useModelStore();
  model.setModel({ ...props.bundle });
  if (isTranslation && props.source) {
    model.setSource(props.source);
  }

  const blocks = ref<ChapterBlock[]>(
    props.bundle.blocks?.length ? normalizedBlocks([...props.bundle.blocks]) : [],
  );
  const attachedResources = ref<ResourceItem[]>([...(props.bundle.resources ?? [])]);
  const availableResources = props.availableResources ?? [];

  watch(
    blocks,
    (value) => {
      model.setField('blocks', value);
    },
    { deep: true, immediate: true },
  );

  watch(
    attachedResources,
    (value) => {
      model.setField('resources', value);
    },
    { deep: true, immediate: true },
  );

  const attachResourceId = new URLSearchParams(window.location.search).get(
    'attachResource',
  );
  attachedResources.value = withAttachedResource(
    attachedResources.value,
    availableResources,
    attachResourceId,
  );

  const defaultTitle = computed(() => `New ${props.story.chapterType}`);
  const title = ref(props.bundle.title);

  const pageTitle = computed(() =>
    props.isCreate ? 'Add Chapter' : `Edit ${props.story.chapterType ?? 'Chapter'}`,
  );

  const headerSubtitle = computed(() => {
    if (props.isCreate) return 'Create a new chapter';
    return title.value?.trim() || `Edit ${props.story.chapterType ?? 'Chapter'}`;
  });

  const chapterTitle = computed(() => {
    if (title.value === defaultTitle.value) return defaultTitle.value;
    return (
      safeChapterTitle(title.value, props.story.name, props.draft.number) ??
      defaultTitle.value
    );
  });

  const layoutTitle = computed(() => (isTranslation ? 'Draft' : pageTitle.value));
  const layoutSubtitle = computed(() =>
    isTranslation ? chapterTitle.value : headerSubtitle.value,
  );

  const metaChapter = computed(
    () => `${padZero(props.draft.number)} of ${padZero(props.story.chapterLimit)}`,
  );

  const publishedWhen = computed(() =>
    props.lastPublished === '' ? 'Unpublished' : formatDate(props.lastPublished),
  );

  const tabs = computed((): NavigationPaneTab[] => [
    {
      label: 'Details',
      hasError: standardChapterEditTabHasError('details', errors.value),
    },
    {
      label: 'Blocks',
      hasError: standardChapterEditTabHasError('blocks', errors.value),
    },
    {
      label: 'Resources',
      hasError: standardChapterEditTabHasError('resources', errors.value),
    },
  ]);

  const currentTab = ref(
    findStandardChapterTab(new URLSearchParams(window.location.search).get('tab')),
  );

  const onTabChange = (tab: string) => {
    currentTab.value = findStandardChapterTab(tab);
  };

  const focusFirstErroredTab = () => {
    const tab = firstStandardChapterEditTabWithError(errors.value);
    if (tab) {
      currentTab.value = findStandardChapterTab(tab);
    }
  };

  const getPayload = () =>
    buildStandardChapterPayload(
      model.model as Record<string, unknown>,
      attachedResources.value,
    );

  const previewBundle = computed(() => getPayload().bundle);

  const onSuccess = (message?: string) => {
    widgets.setIsDirty(false);
    if (!message) return;
    shared.addMessage(ResponseStatus.Confirmation, message);
  };

  const onError = (validationErrors: Errors, message: string, focusErrors = true) => {
    widgets.setIsDirty(false);
    shared.setErrors(validationErrors);
    if (focusErrors) {
      focusFirstErroredTab();
    }
    shared.addMessage(ResponseStatus.Failure, message);
  };

  const saveDraft = () => {
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
        onError: (validationErrors) =>
          onError(validationErrors, `${props.story.chapterType} not saved`, false),
      },
    );
  };

  const autosave = createAutosaveScheduler(saveDraft);

  const deleteDraft = () => {
    autosave.cancel();
    router.delete(`/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}`, {
      preserveScroll: true,
      onSuccess: () => onSuccess('Draft successfully deleted'),
      onError: (validationErrors) => onError(validationErrors, 'Error deleting draft'),
    });
  };

  const submitDraft = () => {
    autosave.cancel();
    router.post(
      `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/submit`,
      getPayload(),
      {
        preserveScroll: true,
        onSuccess: () => onSuccess(`${props.story.chapterType} submitted for review`),
        onError: (validationErrors) =>
          onError(
            validationErrors,
            'Draft not submitted. Please review and correct any errors.',
          ),
      },
    );
  };

  const publishDraft = () => {
    autosave.cancel();
    widgets.setIsDirty(true);
    router.post(
      `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/publish`,
      getPayload(),
      {
        preserveScroll: true,
        onSuccess: () => onSuccess(`${props.story.chapterType} published successfully`),
        onError: (validationErrors) =>
          onError(
            validationErrors,
            `${props.story.chapterType} not published. Please review and correct any errors.`,
          ),
      },
    );
  };

  const targetLanguageName = computed(() => shared.language.language);

  const tracker = useTranslationTrackerStore();
  const notifiedCompleteJobIds = new Set<number>();

  const isAutoTranslating = computed(() =>
    tracker.jobs.some(
      (job) =>
        job.draftId === props.draft.id &&
        (job.status === 'pending' || job.status === 'processing'),
    ),
  );

  watch(
    () => tracker.jobs,
    (jobs) => {
      const completedHere = jobs.find(
        (job) =>
          job.draftId === props.draft.id &&
          job.status === 'complete' &&
          !notifiedCompleteJobIds.has(job.id),
      );
      if (!completedHere) return;

      notifiedCompleteJobIds.add(completedHere.id);
      shared.addMessage(
        ResponseStatus.Confirmation,
        'Translation complete — reload this page to see the changes.',
      );
    },
    { deep: true },
  );

  const showAutoTranslateModal = ref(false);
  const isEstimating = ref(false);
  const inputTokens = ref<number | null>(null);
  const outputTokens = ref<number | null>(null);
  const balance = ref<number | null>(null);

  const autoTranslate = async () => {
    showAutoTranslateModal.value = true;
    isEstimating.value = true;
    inputTokens.value = null;
    outputTokens.value = null;
    balance.value = null;

    try {
      const response = await axios.post(
        `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/estimate-translation`,
        { source: props.source, targetLocale: shared.locale },
      );
      inputTokens.value = response.data.inputTokens;
      outputTokens.value = response.data.outputTokens;
      balance.value = response.data.balance;
    } catch (error) {
      console.error('use-standard-chapter-edit.autoTranslate', error);
      showAutoTranslateModal.value = false;
      shared.addMessage(ResponseStatus.Failure, 'Could not estimate translation cost');
    } finally {
      isEstimating.value = false;
    }
  };

  const closeAutoTranslateModal = () => {
    showAutoTranslateModal.value = false;
  };

  const confirmAutoTranslate = async () => {
    showAutoTranslateModal.value = false;

    try {
      const response = await axios.post(
        `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/auto-translate`,
        { source: props.source, targetLocale: shared.locale },
      );
      tracker.addOptimisticJob({
        id: response.data.jobId,
        storyId: props.story.id,
        draftId: props.draft.id,
        chapterNumber: props.draft.number,
        locale: shared.locale,
        chapterTitle: props.source?.title ?? '',
        status: 'pending',
      });
      shared.addMessage(
        ResponseStatus.Confirmation,
        'Translation started — track its progress in the corner. You can navigate away.',
      );
    } catch (error) {
      console.error('use-standard-chapter-edit.confirmAutoTranslate', error);
      const message =
        (axios.isAxiosError(error) && error.response?.data?.error) || 'Auto translate failed';
      shared.addMessage(ResponseStatus.Failure, message);
    }
  };

  const rejectDraft = () => {
    autosave.cancel();
    router.post(
      `/${shared.locale}/story/${props.story.id}/draft/${props.draft.id}/reject`,
      getPayload(),
      {
        preserveScroll: true,
        onSuccess: () => onSuccess('Draft sent back for fixing'),
        onError: (validationErrors) =>
          onError(validationErrors, 'Error sending draft back'),
      },
    );
  };

  const createResource = () => {
    autosave.cancel();
    const params = new URLSearchParams(window.location.search);
    params.set('tab', 'Resources');
    const returnTo = `${window.location.pathname}?${params.toString()}`;
    const encodedReturnTo = encodeURIComponent(returnTo);
    router.visit(`/${shared.locale}/resource/create?returnTo=${encodedReturnTo}`);
  };

  const updateBlocks = (value: ChapterBlock[]) => {
    blocks.value = value;
  };

  let unsubscribeModel: (() => void) | undefined;

  onMounted(() => {
    if (Object.keys(props.errors ?? {}).length > 0) {
      focusFirstErroredTab();
    }

    unsubscribeModel = model.$subscribe(() => {
      widgets.setIsDirty(true);
      title.value = model.getField('title', defaultTitle.value);
      autosave.schedule();
    });
  });

  onUnmounted(() => {
    autosave.cancel();
    unsubscribeModel?.();
  });

  return {
    attachedResources,
    autoTranslate,
    availableResources,
    balance,
    blocks,
    closeAutoTranslateModal,
    confirmAutoTranslate,
    createResource,
    currentTab,
    deleteDraft,
    inputTokens,
    isAutoTranslating,
    isEstimating,
    layoutSubtitle,
    layoutTitle,
    metaChapter,
    outputTokens,
    previewBundle,
    publishDraft,
    publishedWhen,
    rejectDraft,
    shared,
    showAutoTranslateModal,
    submitDraft,
    tabs,
    targetLanguageName,
    onTabChange,
    updateBlocks,
  };
}

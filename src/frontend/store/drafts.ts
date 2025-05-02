import { defineStore } from 'pinia';
import { DraftEditProps, DraftMeta, StorySpec } from '../../types';
import { ref } from 'vue';
import type { Ref } from 'vue';

export const useDraftsStore = defineStore('drafts', () => {
  const story: Ref<StorySpec> = ref({} as StorySpec);
  const draft: Ref<DraftMeta> = ref({} as DraftMeta);
  const lastPublished = ref('');

  const setFromProps = (props: DraftEditProps) => {
    story.value = props.spec;
    lastPublished.value = props.lastPublished;
    draft.value = props.draft;
  };

  const isSingleColumn = ref(false);
  const setSingleColumn = (value: boolean) => {
    isSingleColumn.value = value;
  };

  const showMetaBox = ref(true);
  const toggleMetaBox = () => {
    showMetaBox.value = !showMetaBox.value;
  };

  const showAppPreview = ref(true);
  const toggleAppPreview = () => {
    showAppPreview.value = !showAppPreview.value;
  };

  const hasFloatingDraftSidebar = ref(false);
  const setDraftSidebarAsFloating = (value: boolean) => {
    hasFloatingDraftSidebar.value = value;
  };

  const setStatus = (status: string) => {
    draft.value.status = status;
  };

  return {
    story,
    lastPublished,
    draft,

    setFromProps,

    isSingleColumn,
    setSingleColumn,

    setStatus,

    hasFloatingDraftSidebar,
    setDraftSidebarAsFloating,

    showMetaBox,
    toggleMetaBox,

    showAppPreview,
    toggleAppPreview,
  };
});

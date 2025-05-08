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

  const setStatus = (status: string) => {
    draft.value.status = status;
  };

  return {
    story,
    lastPublished,
    draft,

    setFromProps,

    setStatus,
  };
});

import { defineStore } from 'pinia';
import { DraftEditProps, DraftMeta, FieldSpec } from '../../types';
import { ref } from 'vue';
import type { Ref } from 'vue';

export const useDraftsStore = defineStore('drafts', () => {
  const fields: Ref<FieldSpec[]> = ref([]);
  const draft: Ref<DraftMeta> = ref({} as DraftMeta);
  const lastPublished = ref('');

  const setFromProps = (props: DraftEditProps) => {
    fields.value = props.fields;
    lastPublished.value = props.lastPublished;
    draft.value = props.draft;
  };

  const setStatus = (status: string) => {
    draft.value.status = status;
  };

  return {
    fields,
    lastPublished,
    draft,

    setFromProps,

    setStatus,
  };
});

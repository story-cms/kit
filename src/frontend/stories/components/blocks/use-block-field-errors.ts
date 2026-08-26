import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useSharedStore } from '../../../store';
import {
  blockFieldErrorMessages,
  blockHasError,
  blockItemFieldErrorMessages,
  blockLevelErrorMessages,
} from './block-field-errors';

export function useBlockFieldErrors(blockIndex: number) {
  const shared = useSharedStore();
  const { errors } = storeToRefs(shared);

  const hasError = computed(() => blockHasError(errors.value, blockIndex));
  const blockLevelErrors = computed(() =>
    blockLevelErrorMessages(errors.value, blockIndex),
  );

  const fieldMessages = (field: string) =>
    blockFieldErrorMessages(errors.value, blockIndex, field);

  const fieldHasError = (field: string) => fieldMessages(field).length > 0;

  const itemFieldMessages = (itemIndex: number, field: string) =>
    blockItemFieldErrorMessages(errors.value, blockIndex, itemIndex, field);

  const itemFieldHasError = (itemIndex: number, field: string) =>
    itemFieldMessages(itemIndex, field).length > 0;

  const primaryErrorMessage = computed(
    () => blockLevelErrors.value[0] ?? fieldMessages('kind')[0] ?? '',
  );

  return {
    hasError,
    blockLevelErrors,
    fieldMessages,
    fieldHasError,
    itemFieldMessages,
    itemFieldHasError,
    primaryErrorMessage,
  };
}

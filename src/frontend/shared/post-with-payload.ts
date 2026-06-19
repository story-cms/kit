import { router } from '@inertiajs/vue3';
import type { RequestPayload } from '@inertiajs/core';
import { ResponseStatus } from '../../types';
import { useSharedStore } from '../store';

type PostOptions = {
  onSuccess?: () => void;
  onError?: () => void;
  successMessage?: string;
  successDetail?: string;
  failureMessage?: string;
};

export const postWithPayload = (
  url: string,
  payload: Record<string, unknown> | object = {},
  options: PostOptions = {},
) => {
  const shared = useSharedStore();

  router.post(url, payload as RequestPayload, {
    preserveScroll: true,
    onSuccess: () => {
      if (options.successMessage) {
        shared.addMessage(
          ResponseStatus.Confirmation,
          options.successMessage,
          options.successDetail,
        );
      }
      options.onSuccess?.();
    },
    onError: (errors) => {
      shared.setErrors(errors);
      if (options.failureMessage) {
        shared.addMessage(ResponseStatus.Failure, options.failureMessage);
      }
      options.onError?.();
    },
  });
};

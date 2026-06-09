import { router } from '@inertiajs/vue3';
import type { RequestPayload } from '@inertiajs/core';
import { useSharedStore } from '../store';
import { ResponseStatus } from '../../types';

type PostSettingsOptions = {
  onSuccess?: () => void;
  onError?: () => void;
  successMessage?: string;
  successDetail?: string;
  failureMessage?: string;
};

export const settingsActions = () => {
  const shared = useSharedStore();

  const postSettings = (
    url: string,
    payload: Record<string, unknown> | object = {},
    options: PostSettingsOptions = {},
  ) => {
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

  return { postSettings };
};

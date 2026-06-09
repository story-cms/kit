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
  const locale = shared.locale;

  const settingsPath = () => `/${locale}/settings`;
  const languagesEditPath = () => `/${locale}/settings/languages/edit`;
  const languagesAddPath = () => `/${locale}/settings/languages/add`;
  const supportPath = () => `/${locale}/settings/support`;
  const languageRemovePath = (languageLocale: string) =>
    `/${locale}/settings/languages/${languageLocale}/remove`;
  const languageBibleTranslationPath = (languageLocale: string) =>
    `/${locale}/settings/languages/${languageLocale}/bible-translation`;

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

  const visitSettings = (options: { onSuccess?: () => void } = {}) => {
    router.visit(settingsPath(), { preserveScroll: true, ...options });
  };

  return {
    settingsPath,
    languagesEditPath,
    languagesAddPath,
    supportPath,
    languageRemovePath,
    languageBibleTranslationPath,
    postSettings,
    visitLanguagesEdit: () => router.visit(languagesEditPath()),
    visitSettings,
  };
};

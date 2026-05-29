<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Settings">
        <template #actions>
          <PillButton
            label="Request App Update"
            variant="green"
            :disabled="!props.requireAppUpdate"
            @click="showRequestAppUpdateModal = true"
          />
        </template>
        <template #extra-actions>
          <div class="flex items-center justify-between pb-4">
            <div>
              <h3 class="text-xl/7 font-semibold leading-7 text-gray-800">Languages</h3>
              <p class="text-sm/5 font-normal leading-5 text-gray-500">
                Here you can manage your languages. Press the blue + to add a new
                language.
              </p>
            </div>
            <button
              class="rounded-full bg-blue-500 p-1 shadow-md hover:bg-blue-700"
              @click="router.visit(`/${shared.locale}/settings/languages/edit`)"
            >
              <Icon name="plus" class="text-white" />
            </button>
          </div>
        </template>
      </ContentHeader>
    </template>
    <SourceLang
      :spec="shared.sourceLanguage"
      @bible-translation-change="handleSourceBibleTranslationChange"
    />
    <div class="mt-14">
      <LanguagesTable
        :items="shared.languageItems"
        @remove="handleRemove"
        @request-deletion="handleRequestDeletion"
        @bible-translation-change="handleTableBibleTranslationChange"
      />
    </div>

    <RequestAppUpdateModal
      :open="showRequestAppUpdateModal"
      @close="showRequestAppUpdateModal = false"
      @confirm="handleRequestAppUpdateConfirm"
    />

    <RequestFeedbackModal
      :open="showFeedbackModal"
      :variant="feedbackModalVariant"
      :contact-email="widgets.providers.supportEmail ?? 'ops@scoutredeem.co'"
      @close="showFeedbackModal = false"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import type { RequestPayload } from '@inertiajs/core';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import Icon from '../shared/icon.vue';
import PillButton from '../shared/pill-button.vue';
import SourceLang from './languages/components/source-language.vue';
import LanguagesTable from './languages/components/language-table.vue';
import RequestAppUpdateModal from './languages/components/request-app-update-modal.vue';
import RequestFeedbackModal from './languages/components/request-feedback-modal.vue';
import { parseLanguageSpecification } from '../shared/helpers';
import {
  type LanguageSpecification,
  type LanguageTableItem,
  type SettingsPageProps,
  type SharedPageProps,
  type SupportRequest,
  SUPPORT_CODES,
  ResponseStatus,
} from '../../types';
import { useSharedStore, useWidgetsStore } from '../store';

const props = defineProps<SettingsPageProps & SharedPageProps>();

const shared = useSharedStore();
const widgets = useWidgetsStore();

shared.setFromProps(props);
shared.setCurrentStoryName('');
shared.setSourceLanguage(props.sourceLanguage);
shared.setLanguageItems(props.languageItems ?? []);
widgets.setProviders(props.providers);

const showRequestAppUpdateModal = ref(false);
const showFeedbackModal = ref(false);
const feedbackModalVariant = ref<'success' | 'error'>('success');

const supportCodeForAppUpdateReason = (reason: string) => {
  if (reason === 'New language') return SUPPORT_CODES.UPDATE_LANGUAGE;
  if (reason === 'New content') return SUPPORT_CODES.UPDATE_CONTENT;
  return undefined;
};

const buildSupportPayload = (
  supportCode: (typeof SUPPORT_CODES)[keyof typeof SUPPORT_CODES],
  languageSpec?: LanguageSpecification,
): SupportRequest => ({
  supportCode: supportCode.code,
  context: {
    ...(languageSpec && {
      languageSpec: parseLanguageSpecification(languageSpec),
    }),
    requestedBy: shared.user.name,
    details: supportCode.description,
    subject: supportCode.subject,
  },
});

const postSupportRequest = (
  payload: SupportRequest,
  options: {
    onSuccess?: () => void;
    onError?: () => void;
  } = {},
) => {
  router.post(
    `/${shared.locale}/settings/support`,
    payload as unknown as RequestPayload,
    {
      preserveScroll: true,
      onSuccess: options.onSuccess,
      onError: (errors) => {
        shared.setErrors(errors);
        options.onError?.();
      },
    },
  );
};

const handleRequestAppUpdateConfirm = (reasons: string[]) => {
  showRequestAppUpdateModal.value = false;

  const supportCodes = reasons
    .map(supportCodeForAppUpdateReason)
    .filter((code): code is NonNullable<typeof code> => code !== undefined);

  if (supportCodes.length === 0) {
    feedbackModalVariant.value = 'error';
    showFeedbackModal.value = true;
    return;
  }

  let completed = 0;
  let hasError = false;

  supportCodes.forEach((supportCode) => {
    postSupportRequest(buildSupportPayload(supportCode), {
      onSuccess: () => {
        completed += 1;
        if (completed === supportCodes.length && !hasError) {
          feedbackModalVariant.value = 'success';
          showFeedbackModal.value = true;
        }
      },
      onError: () => {
        hasError = true;
        feedbackModalVariant.value = 'error';
        showFeedbackModal.value = true;
      },
    });
  });
};

const handleRemove = (item: LanguageTableItem) => {
  shared.removeLanguageItem(item.locale);
  shared.addMessage(ResponseStatus.Confirmation, 'Language removed');
};

const handleRequestDeletion = (item: LanguageTableItem) => {
  postSupportRequest(buildSupportPayload(SUPPORT_CODES.REMOVE_LANGUAGE, item), {
    onSuccess: () => {
      shared.addMessage(ResponseStatus.Confirmation, 'Language deletion requested');
    },
    onError: () => {
      shared.addMessage(ResponseStatus.Failure, 'Error requesting language deletion');
    },
  });
};

watch(
  () => props.sourceLanguage,
  (next) => {
    shared.setSourceLanguage(next);
  },
  { immediate: true },
);
watch(
  () => props.languageItems,
  (next) => {
    shared.setLanguageItems(next ?? []);
  },
  { immediate: true },
);
watch(
  () => props.config,
  () => {
    shared.setFromProps(props);
  },
  { deep: true },
);

const persistBibleTranslation = (
  languageLocale: string,
  bibleVersion: string,
  bibleVersionName: string,
  onSuccess: () => void,
) => {
  router.post(
    `/${shared.locale}/settings/languages/${languageLocale}/bible-translation`,
    { bibleVersion, bibleVersionName },
    {
      preserveScroll: true,
      onSuccess: () => {
        onSuccess();
        shared.addMessage(ResponseStatus.Confirmation, 'Bible translation changed');
      },
      onError: (errors) => {
        shared.setErrors(errors);
        shared.addMessage(ResponseStatus.Failure, 'Error updating Bible translation');
      },
    },
  );
};

const handleSourceBibleTranslationChange = (
  bibleVersion: string,
  bibleVersionName: string,
) => {
  persistBibleTranslation(
    shared.sourceLanguage.locale,
    bibleVersion,
    bibleVersionName,
    () => shared.setSourceLanguageBibleTranslation(bibleVersion, bibleVersionName),
  );
};

const handleTableBibleTranslationChange = (
  item: LanguageTableItem,
  bibleVersion: string,
  bibleVersionName: string,
) => {
  persistBibleTranslation(item.locale, bibleVersion, bibleVersionName, () =>
    shared.setLanguageItemBibleTranslation(item.locale, bibleVersion, bibleVersionName),
  );
};
</script>

<template>
  <AppLayout title="Settings" subtitle="Manage Settings">
    <template #actions>
      <PillButton
        label="Request App Update"
        variant="green"
        :disabled="!props.requireAppUpdate"
        @click="showRequestAppUpdateModal = true"
      />
    </template>
    <template #controls>
      <div class="flex items-center justify-between pb-4">
        <div>
          <h3 class="text-xl/7 font-semibold leading-7 text-gray-800">Languages</h3>
          <p class="text-sm/5 font-normal leading-5 text-gray-500">
            Here you can manage your languages. Press the blue + to add a new language.
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
    <template #main>
      <div>
        <LanguagesTable
          :items="languageItems"
          :source-language="sourceLanguage"
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
        :contact-email="props.config.supportEmail ?? 'ops@startjourneys.io'"
        @close="showFeedbackModal = false"
      />
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import type { RequestPayload } from '@inertiajs/core';
import AppLayout from '../shared/app-layout.vue';
import Icon from '../shared/icon.vue';
import PillButton from '../shared/pill-button.vue';
import LanguagesTable from './languages/components/language-table.vue';
import RequestAppUpdateModal from './languages/components/request-app-update-modal.vue';
import RequestFeedbackModal from './languages/components/request-feedback-modal.vue';
import { postWithPayload } from '../shared/post-with-payload';
import {
  type LanguageTableItem,
  type SettingsPageProps,
  type SharedPageProps,
  type SupportRequest,
  ResponseStatus,
} from '../../types';
import { useSharedStore, useWidgetsStore } from '../store';

const props = defineProps<SettingsPageProps & SharedPageProps>();

const shared = useSharedStore();
const widgets = useWidgetsStore();

shared.setFromProps(props);
shared.setCurrentStoryName('');

const sourceLanguage = computed(() => props.sourceLanguage);
const languageItems = computed(() => props.languageItems ?? []);

widgets.setProviders(props.providers);

const showRequestAppUpdateModal = ref(false);
const showFeedbackModal = ref(false);
const feedbackModalVariant = ref<'success' | 'error'>('success');

const buildAppUpdatePayload = (reasons: string[]): SupportRequest | null => {
  const hasLanguage = reasons.includes('New language');
  const hasContent = reasons.includes('New content');

  if (hasLanguage && hasContent) {
    return { supportCode: 'UPDATE_APP' };
  }
  if (hasLanguage) {
    return { supportCode: 'UPDATE_LANGUAGE' };
  }
  if (hasContent) {
    return { supportCode: 'UPDATE_CONTENT' };
  }
  return null;
};

const handleRequestAppUpdateConfirm = (reasons: string[]) => {
  showRequestAppUpdateModal.value = false;

  const payload = buildAppUpdatePayload(reasons);
  if (!payload) {
    feedbackModalVariant.value = 'error';
    showFeedbackModal.value = true;
    return;
  }

  postWithPayload(
    `/${shared.locale}/settings/support`,
    payload as unknown as RequestPayload,
    {
      onSuccess: () => {
        feedbackModalVariant.value = 'success';
        showFeedbackModal.value = true;
      },
      onError: () => {
        feedbackModalVariant.value = 'error';
        showFeedbackModal.value = true;
      },
    },
  );
};

const handleRemove = (item: LanguageTableItem) => {
  postWithPayload(
    `/${shared.locale}/settings/languages/${item.locale}/remove`,
    {},
    {
      successMessage: 'Language removed',
      failureMessage: 'Error removing language',
    },
  );
};

const handleRequestDeletion = (item: LanguageTableItem) => {
  postWithPayload(
    `/${shared.locale}/settings/support`,
    { supportCode: 'REMOVE_LANGUAGE', removeLanguageCode: item.locale },
    {
      onSuccess: () => {
        shared.addMessage(ResponseStatus.Confirmation, 'Language deletion requested');
      },
      onError: () => {
        shared.addMessage(ResponseStatus.Failure, 'Error requesting language deletion');
      },
    },
  );
};

const handleTableBibleTranslationChange = (
  item: LanguageTableItem,
  bibleVersion: string,
  bibleVersionName: string,
) => {
  postWithPayload(
    `/${shared.locale}/settings/languages/${item.locale}/bible-translation`,
    { bibleVersion, bibleVersionName },
    {
      successMessage: 'Bible translation changed',
      failureMessage: 'Error updating Bible translation',
    },
  );
};
</script>

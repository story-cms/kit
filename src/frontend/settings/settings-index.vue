<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Settings">
        <template #actions>
          <PillButton
            label="Request App Update"
            variant="green"
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
      :contact-email="shared.meta.mailFromAddress ?? 'ops@scoutredeem.co'"
      @close="showFeedbackModal = false"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import Icon from '../shared/icon.vue';
import PillButton from '../shared/pill-button.vue';
import SourceLang from './languages/components/source-language.vue';
import LanguagesTable from './languages/components/language-table.vue';
import RequestAppUpdateModal from './languages/components/request-app-update-modal.vue';
import RequestFeedbackModal from './languages/components/request-feedback-modal.vue';
import {
  type LanguageTableItem,
  type SettingsPageProps,
  type SharedPageProps,
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

const handleRequestAppUpdateConfirm = async (reason: string) => {
  showRequestAppUpdateModal.value = false;
  try {
    // TODO: Replace with actual API call
    await submitAppUpdateRequest(reason);
    feedbackModalVariant.value = 'success';
    showFeedbackModal.value = true;
  } catch {
    feedbackModalVariant.value = 'error';
    showFeedbackModal.value = true;
  }
};

const submitAppUpdateRequest = async (_reason: string): Promise<void> => {
  console.log('submitAppUpdateRequest', _reason);
  shared.addMessage(ResponseStatus.Confirmation, 'App update request submitted');
};

const handleRemove = (item: LanguageTableItem) => {
  shared.removeLanguageItem(item.locale);
  shared.addMessage(ResponseStatus.Confirmation, 'Language removed');
};

const handleRequestDeletion = (_item: LanguageTableItem) => {
  console.log('request language deletion', _item.locale);
  shared.addMessage(ResponseStatus.Confirmation, 'Language deletion requested');
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

const handleSourceBibleTranslationChange = (
  bibleVersion: string,
  bibleVersionName: string,
) => {
  shared.setSourceLanguageBibleTranslation(bibleVersion, bibleVersionName);
  shared.addMessage(ResponseStatus.Confirmation, 'Bible translation changed');
};

const handleTableBibleTranslationChange = (
  item: LanguageTableItem,
  bibleVersion: string,
  bibleVersionName: string,
) => {
  console.log(
    'handleTableBibleTranslationChange',
    item.locale,
    bibleVersion,
    bibleVersionName,
  );
  router.post(
    `/${shared.locale}/settings/languages/${item.locale}/bible-translation`,
    { bibleVersion, bibleVersionName },
    {
      preserveScroll: true,
      onSuccess: () => {
        shared.setLanguageItemBibleTranslation(
          item.locale,
          bibleVersion,
          bibleVersionName,
        );
        shared.addMessage(ResponseStatus.Confirmation, 'Bible translation changed');
      },
      onError: (errors) => {
        shared.setErrors(errors);
        shared.addMessage(ResponseStatus.Failure, 'Error updating Bible translation');
      },
    },
  );
};
</script>

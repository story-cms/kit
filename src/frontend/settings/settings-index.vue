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
      :spec="sourceLanguage"
      @bible-translation-change="handleBibleTranslationChange"
    />
    <div class="mt-14">
      <LanguagesTable
        :items="items"
        @remove="handleRemove"
        @request-deletion="handleRequestDeletion"
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
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import Icon from '../shared/icon.vue';
import PillButton from '../shared/pill-button.vue';
import SourceLang from './languages/components/source-language.vue';
import LanguagesTable from './languages/components/language-table.vue';
import RequestAppUpdateModal from './languages/components/request-app-update-modal.vue';
import RequestFeedbackModal from './languages/components/request-feedback-modal.vue';
import type { LanguageTableItem, SettingsPageProps, SharedPageProps } from '../../types';
import { useSharedStore, useWidgetsStore } from '../store';

const props = defineProps<SettingsPageProps & SharedPageProps>();

const shared = useSharedStore();
const widgets = useWidgetsStore();

shared.setFromProps(props);
shared.setCurrentStoryName('');
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
};

const handleRemove = (_item: LanguageTableItem) => {
  console.log('remove language', _item.locale);
};

const handleRequestDeletion = (_item: LanguageTableItem) => {
  console.log('request language deletion', _item.locale);
};

const items = computed(() => props.languageItems ?? []);

const handleBibleTranslationChange = (bibleVersion: string, bibleVersionName: string) => {
  console.log('bible translation change', bibleVersion, bibleVersionName);
};
</script>

<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Settings">
        <template #actions>
          <PillButton
            label="Request App Update"
            variant="green"
            @click="requestAppUpdate"
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
              @click="router.visit('/settings/languages/edit')"
            >
              <Icon name="plus" class="text-white" />
            </button>
          </div>
        </template>
      </ContentHeader>
    </template>
    <SourceLang :spec="sourceLanguage" />
    <div class="mt-14">
      <LanguagesTable
        :items="items"
        @remove="handleRemove"
        @request-deletion="handleRequestDeletion"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '../../shared/app-layout.vue';
import ContentHeader from '../../shared/content-header.vue';
import Icon from '../../shared/icon.vue';
import PillButton from '../../shared/pill-button.vue';
import SourceLang from './components/source-language.vue';
import LanguagesTable from './components/language-table.vue';
import type { LanguageTableItem, LanguagesProps, SharedPageProps } from '../../../types';
import { useSharedStore } from '../../store';

const props = defineProps<LanguagesProps & SharedPageProps>();

const shared = useSharedStore();
shared.setFromProps(props);
shared.setCurrentStoryName('');

const requestAppUpdate = () => {
  console.log('requestAppUpdate');
};

const handleRemove = (_item: LanguageTableItem) => {
  console.log('remove language', _item.locale);
};

const handleRequestDeletion = (_item: LanguageTableItem) => {
  console.log('request language deletion', _item.locale);
};

const items = computed(() => props.languageItems ?? []);
</script>

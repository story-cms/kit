<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Settings">
        <template #actions>
          <Actions />
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
              @click="addLanguage"
            >
              <Icon name="plus" class="text-white" />
            </button>
          </div>
        </template>
      </ContentHeader>
    </template>

    <SourceLang
      :language="'English | American'"
      :locale="'en'"
      :language-direction="'ltr'"
      :bible-version-name="'King James Version'"
      :bible-version-abbreviation="'KJV'"
      :bible-version-id="'de4e12af7f28f599-01'"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../../shared/app-layout.vue';
import ContentHeader from '../../shared/content-header.vue';
import Actions from './components/actions.vue';
import Icon from '../../shared/icon.vue';
import SourceLang from './components/source-lang.vue';

const addLanguage = () => {
  console.log('addLanguage');
};
</script>

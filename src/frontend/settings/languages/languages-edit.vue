<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Add new languages">
        <template #description>
          <p class="text-sm font-normal leading-5 text-black">
            Select languages you would like to add. Once you have chosen press add to
            confirm.
          </p>
        </template>
        <template #actions>
          <button
            class="rounded-[38px] border bg-blue-500 px-[15px] py-[9px] text-sm/5 font-medium text-white shadow hover:bg-blue-400 focus:outline-none focus:ring focus:ring-indigo-500 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset]"
            @click="addLanguage"
          >
            Add
          </button>
        </template>
        <template #extra-actions>
          <div class="flex items-center justify-between pb-4">
            <div>
              <h3 class=" text-sm leading-5 font-medium text-gray-800">Selected</h3>
            </div>
          </div>
        </template>
      </ContentHeader>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../../shared/app-layout.vue';
import ContentHeader from '../../shared/content-header.vue';


const addLanguage = () => {
  console.log('addLanguage');
};
</script>

<template>
  <AppLayout>
    <StickyHeader>
      <div class="container px-3 mx-auto">
        <h3 class="font-['Inter'] text-2xl font-semibold text-gray-800 mt-6">
          Interface: {{ language.language }}
        </h3>
        <ui-toolbar></ui-toolbar>
      </div>
    </StickyHeader>

    <section class="container px-3 mx-auto mt-5">
      <div class="grid grid-cols-[24fr_76fr] gap-x-6">
        <div>
          <UiStringItem v-for="item in filteredItems" :key="item.key" :item="item" />
        </div>
        <div>
          <div class="shadow font-['Inter']">
            <div class="grid grid-cols-2 px-8 pt-6 pb-4 gap-x-10">
              <div>
                <label for="translation" class="block font-medium text-gray-700 text-sm/5"
                  >German DE</label
                >
                <div class="mt-1">
                  <textarea
                    rows="4"
                    name="translation"
                    id="translation"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  ></textarea>
                </div>
              </div>
              <div>
                <span class="block font-medium text-gray-700 text-sm/5">English EN</span>
                <div class="mt-1">
                  <span class="font-medium text-gray-900 text-base/5">
                    Explore what the Bible says about Jesus, together with a friend.
                  </span>
                </div>
              </div>
              <div class="grid grid-cols-2 mt-4 col-span-full">
                <div>
                  <span class="block font-medium text-gray-700 text-sm/5">Context</span>
                  <div class="mt-1">
                    <span class="font-medium text-gray-600 text-base/5">
                      Onboarding screen three
                    </span>
                  </div>
                </div>
                <div class="flex items-center justify-end gap-x-6">
                  <button class="p-3 border border-gray-300 rounded-full">
                    <Icon class="size-6" name="flag" />
                  </button>
                  <button class="p-3 border border-blue-500 rounded-full">
                    <Icon class="size-6" name="sparkles" />
                  </button>
                  <button class="p-3 bg-green-500 border border-green-700 rounded-full">
                    <Icon class="text-white size-6" name="check" />
                  </button>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between px-8 pt-4 pb-6 bg-blue-50">
              <div>
                <span class="block font-medium text-sm/5">AI Suggestion</span>
                <div class="mt-1">
                  <span class="font-medium text-blue-500 text-base/5">
                    Onboarding screen three
                  </span>
                </div>
              </div>
              <div class="flex gap-x-6">
                <button
                  type="button"
                  class="w-32 rounded-[38px] border px-[15px] py-[9px] text-sm/5 font-medium text-gray-800 shadow focus:outline-none focus:ring focus:ring-indigo-500 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset]"
                  :class="{
                    'bg-gray-400 opacity-80 hover:bg-gray-400 hover:shadow-none active:opacity-80':
                      isBusy,
                    'bg-white hover:bg-green-400': !isBusy,
                  }"
                >
                  Discard
                </button>
                <button
                  type="button"
                  class="rounded-[38px] border px-[15px] py-[9px] text-sm/5 font-medium text-white shadow focus:outline-none focus:ring focus:ring-indigo-500 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset]"
                  :class="{
                    'bg-gray-400 opacity-80 hover:bg-gray-400 hover:shadow-none active:opacity-80':
                      isBusy,
                    'bg-blue-500 hover:bg-green-400': !isBusy,
                  }"
                >
                  Apply Suggestion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form>
        <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <UiCard
            v-for="item in filteredItems"
            :key="item.key"
            v-model:model="model[item.key]"
            :item="item"
            :error="errors[item.key]"
          />
        </ul>
      </form>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import StickyHeader from '../shared/sticky-header.vue';
import uiToolbar from './components/ui-toolbar.vue';
import UiStringItem from './components/ui-string-item.vue';
import icon from '../shared/icon.vue';
import { router } from '@inertiajs/vue3';

import { ResponseStatus } from '../../types';
import type { UiItem, UiPageProps, SharedPageProps } from '../../types';
import UiCard from '../interface/components/ui-card.vue';
import Icon from '../shared/icon.vue';

type ModelType = { [key: string]: string | undefined };

const props = defineProps<SharedPageProps & UiPageProps>();

const filteredItems = computed(() => {
  return props.items
    .filter((item) => !item.translation)
    .concat(props.items.filter((item) => !!item.translation));
});

console.log(filteredItems.value);

const shared = useSharedStore();
shared.setFromProps(props);

const isBusy = ref(false);

const listToMap = (list: UiItem[]): ModelType => {
  const map: ModelType = {};
  for (const item of list) {
    const key = item.key;
    map[key] = item.translation;
  }
  return map;
};

const startValues = listToMap(props.items);
const model = reactive(startValues);

const save = () => {
  isBusy.value = true;
  router.post('/ui', model, {
    preserveScroll: true,
    onSuccess: () => {
      shared.addMessage(ResponseStatus.Accomplishment, 'Translations saved');
    },
    onError: (errors) => {
      shared.addMessage(ResponseStatus.Failure, 'Error saving translations');
    },
    onFinish: () => {
      isBusy.value = false;
    },
  });
};
</script>

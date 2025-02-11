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
        <div class="h-64 bg-red-500"></div>
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
import { router } from '@inertiajs/vue3';

import { ResponseStatus } from '../../types';
import type { UiItem, UiPageProps, SharedPageProps } from '../../types';
import UiCard from '../interface/components/ui-card.vue';

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

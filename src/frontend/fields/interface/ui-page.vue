<template>
  <AppLayout>
    <StickyHeader>
      <div class="container px-3 mx-auto">
        <div class="flex items-center justify-between py-6">
          <h3 class="font-['Inter'] text-2xl font-semibold text-gray-800">
            App Phrases for {{ language.language }}
          </h3>

          <div class="flex items-center space-x-6">
            <button
              type="button"
              :disabled="isBusy"
              class="w-32 rounded-[38px] border px-[15px] py-[9px] text-sm/5 font-medium text-white shadow focus:outline-none focus:ring focus:ring-indigo-500 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset]"
              :class="{
                'bg-gray-400 opacity-80 hover:bg-gray-400 hover:shadow-none active:opacity-80':
                  isBusy,
                'bg-green-500 hover:bg-green-400': !isBusy,
              }"
              @click.prevent="save"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </StickyHeader>

    <section class="container px-3 mx-auto mt-5">
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
import { useSharedStore } from '../../store';
import AppLayout from '../../shared/app-layout.vue';
import StickyHeader from '../../shared/sticky-header.vue';
import { router } from '@inertiajs/vue3';

import { ResponseStatus } from '../../../types';
import type { UiItem, UiPageProps, SharedPageProps } from '../../../types';
import UiCard from '../interface/components/ui-card.vue';

type ModelType = { [key: string]: string | undefined };

const props = defineProps<SharedPageProps & UiPageProps>();

const filteredItems = computed(() => {
  return props.items
    .filter((item) => !item.translation)
    .concat(props.items.filter((item) => !!item.translation));
});

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

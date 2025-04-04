<template>
  <Transition name="slide-fade">
    <div
      v-show="!isFlagged"
      class="shadow font-['Inter'] rounded-lg border border-gray-200"
    >
      <div class="grid grid-cols-2 px-8 pt-6 pb-4 gap-x-10">
        <div>
          <label :for="item.key" class="block font-medium text-gray-700 text-sm/5">
            {{ shared.language.language }}
            <span class="uppercase">
              {{ shared.locale }}
            </span>
          </label>
          <div class="mt-1">
            <textarea
              :id="item.key"
              :value="model"
              rows="4"
              name="translation"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              @input="
                $emit('update:model', ($event.target as HTMLTextAreaElement)?.value)
              "
            />
            <p
              v-if="error"
              class="text-[#FF2415] font-medium text-sm leading-[120%] mt-4 flex items-center gap-x-[11px]"
            >
              <span>
                <Icon name="exclamation-circle" />
              </span>
              {{ error }}
            </p>
          </div>
        </div>
        <div>
          <span class="block font-medium text-gray-700 text-sm/5">English EN</span>
          <div class="mt-1">
            <span class="font-medium text-gray-900 text-base/5">
              {{ item.source }}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-2 mt-4 col-span-full">
          <div>
            <div v-if="item.description">
              <span class="block font-medium text-gray-700 text-sm/5"
                >Context {{ item.flag }}</span
              >
              <div class="mt-1">
                <span class="font-medium text-gray-600 text-base/5">
                  {{ item.description }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-x-6">
            <button
              type="button"
              @click="setFlag(State.RECHECK)"
              class="p-3 border border-gray-300 rounded-full"
              :disabled="!model"
            >
              <Icon
                class="w-auto h-6"
                :class="{
                  'text-[#F59E0B]': item.flag === 'recheck',
                  'text-gray-700': item.flag !== 'recheck',
                }"
                name="flag"
              />
            </button>
            <button
              type="button"
              @click="aiTranslate"
              class="p-3 border border-gray-300 rounded-full"
            >
              <Icon
                class="w-auto h-6"
                :class="{
                  'text-blue-500': item.flag === 'prefilled',
                  'text-gray-700': item.flag !== 'prefilled',
                }"
                name="sparkles"
              />
            </button>
            <button
              type="button"
              @click="
                store({
                  key: props.item.key,
                  locale: shared.locale,
                  translation: props.model ?? '',
                  isPrefilled: false,
                })
              "
              class="p-3 border border-gray-300 rounded-full disabled:border-gray-300 disabled:bg-gray-100"
              :disabled="!model"
              :class="{ 'bg-green-500 border-green-800': model }"
            >
              <Icon
                class="w-auto h-6 text-gray-700"
                :class="{ 'text-gray-300': !model, 'text-white': model }"
                name="check"
              />
            </button>
          </div>
        </div>
      </div>
      <div v-show="isOpen" class="px-8 pt-4 pb-6 bg-blue-50">
        <div v-show="isLoading">
          <div class="flex space-x-4 animate-pulse">
            <div class="flex-1 py-1 space-y-6">
              <div class="h-2 bg-gray-200 rounded"></div>
              <div class="space-y-3">
                <div class="grid grid-cols-3 gap-4">
                  <div class="h-2 col-span-2 bg-gray-200 rounded"></div>
                  <div class="h-2 col-span-1 bg-gray-200 rounded"></div>
                </div>
                <div class="h-2 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="!isLoading" class="flex items-center justify-between">
          <div>
            <span class="block font-medium text-sm/5">AI Suggestion</span>
            <div class="mt-1">
              <span v-if="isLoading" class="font-medium text-blue-500 text-base/5">
                Generating suggestion...
              </span>
              <span v-else class="font-medium text-blue-500 text-base/5">
                {{ suggestion ? suggestion : 'No suggestion found' }}
              </span>
            </div>
          </div>
          <div v-show="suggestion.length > 0" class="flex gap-x-6">
            <button
              type="button"
              @click="discardSuggestion"
              class="w-32 rounded-[38px] border px-[15px] py-[9px] text-sm/5 font-medium text-gray-800 shadow focus:outline-none focus:ring focus:ring-indigo-500 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset] bg-white hover:bg-green-400"
            >
              Discard
            </button>
            <button
              type="button"
              @click="applySuggestion"
              class="rounded-[38px] border px-[15px] py-[9px] text-sm/5 font-medium text-white shadow focus:outline-none focus:ring focus:ring-indigo-500 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset] bg-blue-500 hover:bg-green-400"
            >
              Apply Suggestion
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { router } from '@inertiajs/vue3';

import { type UiItem, type UiItemPayload, ResponseStatus } from '../../../types';
import Icon from '../../shared/icon.vue';
import { useSharedStore } from '../../store';

const shared = useSharedStore();
const isOpen = ref(false);
const suggestion = ref('');
const isLoading = ref(false);
const isFlagged = ref(false);
const error = ref('');

const props = defineProps<{
  item: UiItem;
  model: string | undefined;
}>();

const emit = defineEmits<{
  'update:model': [value: string];
  flagged: [key: string];
}>();

enum State {
  PREFILLED = 'prefilled',
  RECHECK = 'recheck',
}

const setFlag = async (state: State) => {
  isFlagged.value = true;
  emit('flagged', props.item.key);

  try {
    const response = await axios.post('/ui/flag', {
      key: props.item.key,
      state,
    });
    if (response.status === 200) {
      router.reload({ only: ['ui', 'items'] });
      shared.addMessage(ResponseStatus.Accomplishment, 'Flag set');
    }
  } catch (_error) {
    shared.addMessage(ResponseStatus.Failure, 'Error setting flag');
  }
};

const discardSuggestion = () => {
  suggestion.value = '';
  isOpen.value = false;
};

const store = async (payload: UiItemPayload) => {
  try {
    const response = await axios.post('/ui', payload);
    if (response.status === 200) {
      router.reload({ only: ['ui', 'items'] });
      shared.addMessage(ResponseStatus.Accomplishment, 'Translations saved');
    }
  } catch (error) {
    error.value = error.response?.data?.message || 'Error saving translation';
    shared.addMessage(ResponseStatus.Failure, 'Error saving translation');
  }
};

const aiTranslate = async () => {
  isLoading.value = true;
  isOpen.value = true;

  try {
    const response = await axios.post('/ui/suggest', {
      key: props.item.key,
      locale: shared.locale,
    });
    if (response.status === 200) {
      suggestion.value = response.data.suggestion;
      isLoading.value = false;
    }
  } catch (error) {
    isOpen.value = false;
    isLoading.value = false;
    shared.addMessage(ResponseStatus.Failure, 'Error generating suggestion');
  }
};

const applySuggestion = () => {
  emit('update:model', suggestion.value);
  isOpen.value = false;
  const payload: UiItemPayload = {
    key: props.item.key,
    locale: shared.locale,
    translation: suggestion.value,
    isPrefilled: true,
  };
  store(payload);
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>

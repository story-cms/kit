<template>
  <Transition name="slide-fade">
    <div v-if="true" class="rounded-lg bg-white font-['Inter'] shadow">
      <div class="grid grid-cols-2 gap-x-10 px-8 pb-4 pt-6">
        <div>
          <label :for="item.key" class="block text-sm/5 font-medium text-gray-700">
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
              class="mt-4 flex items-center gap-x-[11px] text-sm font-medium leading-[120%] text-[#FF2415]"
            >
              <span>
                <Icon name="exclamation-circle" />
              </span>
              {{ error }}
            </p>
          </div>
        </div>
        <div>
          <span class="block text-sm/5 font-medium text-gray-700">English EN</span>
          <div class="mt-1">
            <span class="text-base/5 font-medium text-gray-900">
              {{ item.source }}
            </span>
          </div>
        </div>
        <div class="col-span-full mt-4 grid grid-cols-2">
          <div>
            <div v-if="item.description">
              <span class="block text-sm/5 font-medium text-gray-700">Context</span>
              <div class="mt-1">
                <span class="text-base/5 font-medium text-gray-600">
                  {{ item.description }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-x-6">
            <button
              type="button"
              class="size-10 rounded-full p-2 hover:bg-gray-100"
              :disabled="!model"
              @click="handleSetFlag(FlagState.RECHECK)"
            >
              <Icon
                class="size-6"
                :class="{
                  'text-blue-500': item.flag === FlagState.RECHECK,
                  'text-gray-700': item.flag !== FlagState.RECHECK,
                }"
                name="flag"
              />
            </button>
            <button
              type="button"
              class="size-10 rounded-full p-2 hover:bg-gray-100"
              @click="suggestAi"
            >
              <Icon
                class="size-6"
                :class="{
                  'text-blue-500': item.flag === FlagState.PREFILLED,
                  'text-gray-700': item.flag !== FlagState.PREFILLED,
                }"
                name="sparkles"
              />
            </button>
            <button
              type="button"
              class="rounded-full border border-gray-300 p-2 disabled:border-gray-300 disabled:bg-gray-100"
              :disabled="!model"
              :class="{ 'border-green-800 bg-green-500': model }"
              @click="
                emit('save', {
                  key: props.item.key,
                  locale: shared.locale,
                  translation: props.model ?? '',
                  isPrefilled: false,
                })
              "
            >
              <Icon
                class="h-6 w-auto"
                :class="{ 'text-gray-300': !model, 'text-white': model }"
                name="check"
              />
            </button>
          </div>
        </div>
      </div>
      <div v-show="isOpen" class="bg-blue-50 px-8 pb-6 pt-4">
        <div v-show="isLoading">
          <div class="flex animate-pulse space-x-4">
            <div class="flex-1 space-y-6 py-1">
              <div class="h-2 rounded bg-gray-200"></div>
              <div class="space-y-3">
                <div class="grid grid-cols-3 gap-4">
                  <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                  <div class="col-span-1 h-2 rounded bg-gray-200"></div>
                </div>
                <div class="h-2 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="!isLoading" class="flex items-center justify-between">
          <div>
            <span class="block text-sm/5 font-medium">AI Suggestion</span>
            <div class="mt-1">
              <span v-if="isLoading" class="text-base/5 font-medium text-blue-500">
                Generating suggestion...
              </span>
              <span v-else class="text-base/5 font-medium text-blue-500">
                {{ suggestion ? suggestion : 'No suggestion found' }}
              </span>
            </div>
          </div>
          <div v-show="suggestion.length > 0" class="flex gap-x-6">
            <button
              type="button"
              class="w-32 rounded-[38px] border bg-white px-[15px] py-[9px] text-sm/5 font-medium text-gray-800 shadow hover:bg-green-400 focus:outline-none focus:ring focus:ring-indigo-500 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset]"
              @click="discardSuggestion"
            >
              Discard
            </button>
            <button
              type="button"
              class="rounded-[38px] border bg-blue-500 px-[15px] py-[9px] text-sm/5 font-medium text-white shadow hover:bg-green-400 focus:outline-none focus:ring focus:ring-indigo-500 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset]"
              @click="applySuggestion"
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

import { type UiItem, type UiItemPayload } from '../../../types';
import { FlagState, ResponseStatus } from '../../../constants';
import Icon from '../../shared/icon.vue';
import { useSharedStore } from '../../store';

const shared = useSharedStore();
const isOpen = ref(false);
const suggestion = ref('');
const isLoading = ref(false);

const props = defineProps<{
  item: UiItem;
  model: string | undefined;
  error: string | undefined;
}>();

const emit = defineEmits<{
  'update:model': [value: string];
  flagged: [key: string];
  'set-flag': [key: string, state: FlagState];
  save: [payload: UiItemPayload];
  'apply-suggestion': [suggestion: string];
}>();

const handleSetFlag = (state: FlagState) => {
  emit('set-flag', props.item.key, state);
  emit('flagged', props.item.key);
};

const discardSuggestion = () => {
  suggestion.value = '';
  isOpen.value = false;
};

const suggestAi = async () => {
  isLoading.value = true;
  isOpen.value = true;

  try {
    const response = await axios.post(`/${shared.locale}/ui/suggest`, {
      key: props.item.key,
      locale: shared.locale,
    });
    if (response.status === 200) {
      suggestion.value = response.data.suggestion;
      isLoading.value = false;
    }
  } catch (error) {
    console.error('ui-card.suggestAi', error);
    isOpen.value = false;
    isLoading.value = false;
    shared.addMessage(ResponseStatus.Failure, 'Error generating suggestion');
  }
};

const applySuggestion = () => {
  emit('apply-suggestion', suggestion.value);
  isOpen.value = false;
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

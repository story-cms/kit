<template>
  <Transition name="slide-fade">
    <div v-if="true" class="rounded-xl bg-white font-['Inter'] shadow">
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
              class="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              @input="
                $emit('update:model', ($event.target as HTMLTextAreaElement)?.value)
              "
            />
            <p
              v-if="error"
              class="mt-4 flex items-center gap-x-[11px] text-sm font-medium leading-[120%] text-[#FF2415]"
            >
              <CircleAlert class="size-5 shrink-0" aria-hidden="true" />
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
              aria-label="Flag for recheck"
              class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!model"
              @click="handleSetFlag(FlagState.RECHECK)"
            >
              <Flag
                class="size-5"
                :class="{
                  'text-blue-500': item.flag === FlagState.RECHECK,
                  'text-gray-400': item.flag !== FlagState.RECHECK,
                }"
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              aria-label="Suggest translation"
              class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
              @click="suggestAi"
            >
              <Sparkles
                class="size-5"
                :class="{
                  'text-blue-500': item.flag === FlagState.PREFILLED,
                  'text-gray-400': item.flag !== FlagState.PREFILLED,
                }"
                aria-hidden="true"
              />
            </button>
            <StudioButton
              aria-label="Save translation"
              variant="green"
              :disabled="!model"
              @click="saveTranslation"
            >
              <Check class="size-4" aria-hidden="true" />
            </StudioButton>
          </div>
        </div>
      </div>
      <div v-show="isOpen" class="bg-blue-50 px-8 pb-6 pt-4">
        <div v-show="isLoading">
          <div class="flex animate-pulse space-x-4">
            <div class="flex-1 space-y-6 py-1">
              <div class="h-2 rounded-xl bg-gray-200"></div>
              <div class="space-y-3">
                <div class="grid grid-cols-3 gap-4">
                  <div class="col-span-2 h-2 rounded-xl bg-gray-200"></div>
                  <div class="col-span-1 h-2 rounded-xl bg-gray-200"></div>
                </div>
                <div class="h-2 rounded-xl bg-gray-200"></div>
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
            <StudioButton label="Discard" variant="outline" @click="discardSuggestion" />
            <StudioButton
              label="Apply Suggestion"
              variant="secondary"
              @click="applySuggestion"
            />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Check, CircleAlert, Flag, Sparkles } from '@lucide/vue';

import {
  type UiItem,
  type UiItemPayload,
  FlagState,
  ResponseStatus,
} from '../../../types';
import { useSharedStore } from '../../store';
import StudioButton from '../../shared/studio-button.vue';

const shared = useSharedStore();
const isOpen = ref(false);
const suggestion = ref('');
const isLoading = ref(false);

const props = defineProps<{
  item: UiItem;
  model: string | undefined;
  error: string | undefined;
  initialSuggestion?: string;
  initialSuggestionLoading?: boolean;
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

const saveTranslation = () => {
  emit('save', {
    key: props.item.key,
    locale: shared.locale,
    translation: props.model ?? '',
    isPrefilled: false,
  });
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

onMounted(() => {
  if (props.initialSuggestionLoading) {
    isOpen.value = true;
    isLoading.value = true;
    return;
  }

  if (props.initialSuggestion) {
    isOpen.value = true;
    suggestion.value = props.initialSuggestion;
    isLoading.value = false;
  }
});
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

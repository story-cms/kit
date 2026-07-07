<template>
  <div class="space-y-4">
    <div v-if="selectedLanguages.length > 0" class="flex items-center justify-between">
      <div class="flex items-center justify-start gap-4">
        <h3 class="text-xs font-medium uppercase leading-5 text-gray-800">Selected:</h3>

        <ul class="flex flex-wrap gap-x-4 gap-y-2">
          <li
            v-for="language in selectedLanguages"
            :key="language.locale"
            class="inline-flex items-center gap-2 rounded-full bg-gray-100 py-1.5 pl-3 pr-2 text-xs font-medium leading-4 text-gray-900"
          >
            {{ language.language }}
            <button
              type="button"
              class="text-gray-800"
              :aria-label="`Remove ${language.language}`"
              @click="emit('remove', language.locale)"
            >
              <X class="size-3.5" aria-hidden="true" />
            </button>
          </li>
        </ul>
      </div>
    </div>

    <ul class="flex flex-row flex-wrap items-center gap-[10px] py-[9px] pl-2">
      <li>
        <ExpandableSearch
          v-model="searchFilter"
          placeholder="Search"
          clear-on-collapse
        />
      </li>
      <li v-for="letter in letters" :key="letter">
        <button
          type="button"
          class="font-dmsans flex size-7 shrink-0 items-center justify-center rounded-full p-0 text-center text-[17px] font-medium leading-5 text-gray-500"
          :class="{ 'bg-blue-100': letterFilter === letter }"
          @click="handleLetterFilter(letter)"
        >
          {{ letter }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { X } from '@lucide/vue';
import type { LanguageSpecification } from '../../../../types';
import ExpandableSearch from '../../../shared/expandable-search.vue';

defineProps<{
  selectedLanguages: LanguageSpecification[];
}>();

const emit = defineEmits<{
  remove: [locale: string];
}>();

const searchFilter = defineModel<string>('searchFilter', { default: '' });
const letterFilter = defineModel<string>('letterFilter', { default: '' });

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

watch(searchFilter, (value) => {
  if (value) letterFilter.value = '';
});

watch(letterFilter, (value) => {
  if (value) searchFilter.value = '';
});

const handleLetterFilter = (letter: string) => {
  letterFilter.value = letterFilter.value === letter ? '' : letter;
};
</script>

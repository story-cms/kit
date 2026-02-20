<template>
  <div class="grid grid-cols-[auto_1fr_auto] gap-x-8 bg-white px-6 py-3">
    <div class="pr-8">
      <h4 class="text-sm/5 font-normal leading-5 text-gray-900">
        {{ language }}
      </h4>
      <p class="text-[14px] font-normal leading-5 text-gray-500">
        {{ nativeName }} ({{ locale }})
      </p>
    </div>
    <div>
      <p class="text-sm/5 font-normal leading-5 text-gray-500">
        ( {{ bibleVersionAbbreviation }} ) {{ bibleVersionName }}
      </p>
    </div>
    <div class="flex flex-col items-center justify-center px-4">
      <button>
        <Icon name="dots-vertical" class="size-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from '../../../shared/icon.vue';

const props = defineProps<{
  language: string;
  locale: string;
  languageDirection: 'rtl' | 'ltr';
  bibleVersionId?: string;
  bibleVersionName?: string;
  bibleVersionAbbreviation?: string;
}>();

// Check language if it looks like this "German | Deutsch" split it into language and native name
const language = computed(() => {
  if (props.language.includes('|')) {
    return props.language.split('|')[0].trim();
  }
  return props.language;
});
const nativeName = computed(() => {
  if (props.language.includes('|')) {
    return props.language.split('|')[1].trim();
  }
  return '';
});
</script>

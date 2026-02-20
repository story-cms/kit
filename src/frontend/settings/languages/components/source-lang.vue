<template>
  <div class="grid gap-8 px-6 py-3 sm:grid-cols-[minmax(200px,auto)_1fr_auto]">
    <div class="pr-8">
      <h4 class="text-sm/5 font-normal leading-5 text-gray-900">
        {{ language }}
      </h4>
      <p class="text-[14px] font-normal leading-5 text-gray-500">
        {{ nativeName }} ({{ spec.locale }})
      </p>
    </div>
    <div class="flex flex-col justify-center">
      <p class="text-sm/5 font-normal leading-5 text-gray-500">
        {{ spec.bibleLabel }}
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
import { LanguageSpecification } from '../../../../types';

const props = defineProps<{ spec: LanguageSpecification }>();

const language = computed(() => {
  if (props.spec.language.includes('|')) {
    return props.spec.language.split('|')[0].trim();
  }
  return props.spec.language;
});
const nativeName = computed(() => {
  if (props.spec.language.includes('|')) {
    return props.spec.language.split('|')[1].trim();
  }
  return props.spec.language;
});
</script>

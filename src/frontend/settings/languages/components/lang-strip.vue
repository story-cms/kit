<template>
  <div>
    <p class="text-sm/5 font-normal leading-5 text-gray-900">
      {{ language }}
    </p>
    <p class="text-[14px] font-normal leading-5 text-gray-500">
      {{ nativeName }} ({{ spec.locale }})
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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

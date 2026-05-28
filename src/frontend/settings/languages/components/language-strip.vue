<template>
  <div>
    <p class="text-sm/5 font-normal leading-5 text-gray-900">
      {{ parsed.name }}
    </p>
    <p class="text-[14px] font-normal leading-5 text-gray-500">
      {{ parsed.nativeName }} ({{ parsed.locale }})
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { LanguageSpecification } from '../../../../types';
import { parseLanguageSpecification } from '../../../shared/helpers';

const props = defineProps<{ spec: LanguageSpecification }>();

const parsed = computed(() => parseLanguageSpecification(props.spec));
</script>

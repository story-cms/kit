<template>
  <div class="grid gap-8 px-6 py-3 sm:grid-cols-[minmax(200px,auto)_1fr_auto]">
    <div class="pr-8">
      <LangStrip :spec="spec" />
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
import Icon from '../../../shared/icon.vue';
import LangStrip from './lang-strip.vue';
import type { LanguageSpecification } from '../../../../types';

defineProps<{ spec: LanguageSpecification }>();
</script>

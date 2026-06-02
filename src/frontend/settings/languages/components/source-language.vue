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
      <button
        type="button"
        class="cursor-pointer text-gray-400 hover:text-gray-600"
        @click="showBibleTranslationsModal = true"
      >
        <Icon name="dots-vertical" class="size-5" />
      </button>
    </div>
  </div>

  <BibleTranslationsModal
    :open="showBibleTranslationsModal"
    :item="specAsItem"
    @close="showBibleTranslationsModal = false"
    @confirm="handleBibleTranslationConfirm"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Icon from '../../../shared/icon.vue';
import LangStrip from './language-strip.vue';
import BibleTranslationsModal from './bible-translations-modal.vue';
import type { LanguageSpecification, LanguageTableItem } from '../../../../types';

const props = defineProps<{ spec: LanguageSpecification }>();

const emit = defineEmits<{
  bibleTranslationChange: [bibleVersion: string, bibleVersionName: string];
}>();

const showBibleTranslationsModal = ref(false);

const specAsItem = computed<LanguageTableItem | null>(() =>
  props.spec ? ({ ...props.spec } as LanguageTableItem) : null,
);

const handleBibleTranslationConfirm = (
  bibleVersion: string,
  bibleVersionName: string,
) => {
  emit('bibleTranslationChange', bibleVersion, bibleVersionName);
  showBibleTranslationsModal.value = false;
};
</script>

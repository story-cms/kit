<template>
  <div>
    <HstButton color="primary" class="htw-p-2 bg-emerald-500" @click="toggle">
      {{ label }}
    </HstButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSharedStore } from '../store';
import { LanguageSpecification } from '../..//interfaces';

const english = {
  locale: 'en',
  language: 'English',
  languageDirection: 'ltr',
  bibleVersion: 'de4e12af7f28f599-01',
} as LanguageSpecification;

const arabic = {
  locale: 'ar',
  language: 'Arabic: عربى',
  languageDirection: 'rtl',
  bibleVersion: 'b17e246951402e50-01',
} as LanguageSpecification;

const store = useSharedStore();
const label = computed(() => {
  return store.isRtl ? 'Set LTR' : 'Set RTL';
});
const toggle = () => {
  if (store.isRtl) {
    store.setLanguage(english);
  } else {
    store.setLanguage(arabic);
  }
};
</script>

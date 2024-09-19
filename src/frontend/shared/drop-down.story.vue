<template>
  <Story title="Drop Down" group="shared">
    <Variant title="With options">
      <DropDown v-model="model" :options="options" @change="onSet" />
    </Variant>
    <Variant title="With long language names">
      <DropDown v-model="language" :options="languages" @change="onLanguage" />
    </Variant>
    <Variant title="Read only">
      <DropDown v-model="model" :options="options" :is-read-only="true" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import DropDown from './drop-down.vue';
import { ref } from 'vue';

const options = ['Add', 'Edit', 'Delete'];
const model = ref('Edit');
const onSet = async (val: string) => {
  model.value = val;
};

const language = ref('French - Français');
const languages = [
  'English',
  'Albanian - Shqipe',
  'Arabic - عربى',
  'Bengali - বাংলা',
  'Chinese - 中文',
  'French - Français',
  'Fulah Adamawa – Fulfulde Adamawa',
  'Georgian – ქართული',
  'German - Deutsch',
  'Hausa',
  'Indonesian - Bahasa Indonesia',
  'Italian - Italiano',
  'Kurdish Sorani – کوردی سۆرانی',
  'Kurmanji - Kurmancî',
  'Persian - فارسی',
  'Portuguese - Português',
  'Russian – Русский',
  'Somali - Af Soomaali',
  'Spanish - Español',
  'Swahili – Kiswahili',
  'Tachelhite - Taclḥiyt',
  'Thai - ภาษาไทย',
  'Turkish - Türkçe',
  'Urdu - اُردو',
  'Uzbek – أۇزبېك ﺗﻴﻠی',
];
const onLanguage = async (val: string) => {
  language.value = val;
};
</script>

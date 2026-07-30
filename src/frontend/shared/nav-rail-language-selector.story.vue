<template>
  <Story title="Nav rail language selector" group="shared" :layout="{ type: 'grid', width: 360 }">
    <Variant title="Panel">
      <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <NavRailLanguageSelector
          v-model="selectedLanguage"
          variant="panel"
          current-locale="en"
          :languages="languages"
          :is-read-only="false"
          @change="selectedLanguage = $event"
        />
      </div>
    </Variant>

    <Variant title="Pill">
      <div class="inline-block rounded-full border border-gray-200 bg-gray-50 p-2">
        <NavRailLanguageSelector
          v-model="selectedLanguage"
          variant="pill"
          current-locale="en"
          :languages="languages"
          :is-read-only="false"
          @change="selectedLanguage = $event"
        />
      </div>
    </Variant>

    <Variant title="Read only">
      <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <NavRailLanguageSelector
          v-model="selectedLanguage"
          variant="panel"
          current-locale="en"
          :languages="languages"
          :is-read-only="true"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavRailLanguageSelector from './nav-rail-language-selector.vue';
import { english, german, spanish, ukrainian } from '../test/mocks';

const languages = [english, spanish, german, ukrainian];
const selectedLanguage = ref(english.language);
</script>

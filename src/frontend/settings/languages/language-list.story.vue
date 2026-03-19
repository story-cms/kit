<template>
  <Story title="Language List" group="settings">
    <Variant title="List" :setup-app="miniSidebar">
      <LanguageList :items="items" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { miniSidebar } from '../../test/mocks';
import LanguageList from './language-list.vue';
import { languages } from './languages';
import type { LanguageListItemProps } from '../../../types';

const items: LanguageListItemProps[] = languages.map((language, index) => ({
  language,
  status: (['selected', 'readonly', 'available'] as const)[index % 3],
}));
</script>

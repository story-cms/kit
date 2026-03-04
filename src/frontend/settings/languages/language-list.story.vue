<template>
    <Story title="Language List" group="settings" >
            <Variant title="List" :setup-app="miniSidebar">
                <LanguageList :items="items" />
            </Variant>

    </Story>
</template>

<script setup lang="ts">
import { miniSidebar } from '../../test/mocks';
import LanguageList, { type LanguageListItemProps } from './language-list.vue';
import { languages } from './languages';

const items: LanguageListItemProps[] = languages.map((language, index) => ({
  language,
  isSelected: index % 3 === 1,
  isAdded: index % 3 === 2,
}));
</script>

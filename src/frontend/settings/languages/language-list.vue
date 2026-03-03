
<template>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[30px] gap-y-1">
    <LanguageListItem v-for="item in items" :key="item.language.locale" :language="item.language" :is-selected="item.isSelected" :is-added="item.isAdded" class="w-full" />
</div>
</template>

<script setup lang="ts">
import type { LanguageSpecification } from '../../../types';
import LanguageListItem from './components/language-list-item.vue';

export interface LanguageListItemProps {
  language: LanguageSpecification;
  isSelected: boolean;
  isAdded: boolean;
}

defineProps<{
  items: LanguageListItemProps[];
}>();
</script>


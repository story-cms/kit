<template>
    <Story title="Language List Item" group="settings">
        <Variant title="Default">
            <LanguageListItem :language="language" :is-selected="true" />
        </Variant>
    </Story>
</template>

<script setup lang="ts">

import LanguageListItem from './language-list-item.vue';
import type { LanguageSpecification } from '../../../../types';

const language: LanguageSpecification = {
    language: 'English',
    locale: 'en',
    languageDirection: 'ltr',
    bibleVersionId: 'de4e12af7f28f599-01',
    bibleLabel: '(KJV) King James Version',
};
</script>
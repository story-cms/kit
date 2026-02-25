<template>
    <Story title="Language List" group="settings">
        <Variant title="List" :setup-app="miniSidebar">
            <LanguageList />
        </Variant>
    </Story>
</template>

<script setup lang="ts">
import { miniSidebar } from '../../test/mocks';
import LanguageList from './language-list.vue';
</script>
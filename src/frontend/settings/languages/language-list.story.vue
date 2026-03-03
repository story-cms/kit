<template>
    <Story title="Language List" group="settings" :layout="{ type: 'grid', width: 350 }">
            <Variant title="List" :setup-app="miniSidebar">
                <LanguageList />
            </Variant>
            <Variant title="Empty" :setup-app="miniSidebar">
                <LanguageList />
            </Variant>
            <Variant title="Loading" :setup-app="miniSidebar">
                <LanguageList />
            </Variant>
            <Variant title="Error" :setup-app="miniSidebar">
                <LanguageList />
            </Variant>
    </Story>
</template>

<script setup lang="ts">
import { miniSidebar } from '../../test/mocks';
import LanguageList from './language-list.vue';
</script>

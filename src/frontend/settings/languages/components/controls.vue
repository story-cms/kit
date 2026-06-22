<template>
  <div class="flex flex-wrap items-center gap-1">
    <TabButton
      v-for="tab in tabs"
      :key="tab.id"
      :label="tab.label"
      :is-active="activeTab === tab.id"
      @click="activeTab = tab.id"
    >
      <component :is="tab.icon" />
    </TabButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IdCard, Users, Languages } from '@lucide/vue';
import TabButton from '../../../shared/tab-button.vue';

const tabs = [
  { id: 'account', label: 'Account', icon: IdCard },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'languages', label: 'Languages', icon: Languages },
] as const;

const activeTab = ref<(typeof tabs)[number]['id']>('languages');
</script>

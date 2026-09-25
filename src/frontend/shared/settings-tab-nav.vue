<template>
  <div class="flex items-center gap-2">
    <TabButton
      v-if="subscribed('languages-settings')"
      label="Languages"
      :is-active="active === 'languages'"
      @click="goTo('languages')"
    >
      <Languages class="size-4" aria-hidden="true" />
    </TabButton>
    <TabButton
      v-if="subscribed('tokens')"
      label="AI tokens"
      :is-active="active === 'tokens'"
      @click="goTo('tokens')"
    >
      <Sparkles class="size-4" aria-hidden="true" />
    </TabButton>
  </div>
</template>

<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { Languages, Sparkles } from '@lucide/vue';
import TabButton from './tab-button.vue';
import { useSharedStore } from '../store';
import { useSidebarNav } from './use-sidebar-nav';

const props = defineProps<{
  active: 'languages' | 'tokens';
}>();

const shared = useSharedStore();
const { subscribed } = useSidebarNav();

const routes: Record<'languages' | 'tokens', string> = {
  languages: 'settings',
  tokens: 'settings/tokens',
};

const goTo = (tab: 'languages' | 'tokens') => {
  if (tab === props.active) return;
  router.visit(`/${shared.locale}/${routes[tab]}`);
};
</script>

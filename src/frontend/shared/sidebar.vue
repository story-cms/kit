<template>
  <NavRailPill v-if="!shared.hasOpenSidebar" />
  <NavRailPanel v-else />
</template>

<script setup lang="ts">
import { useSharedStore } from '../store';
import NavRailPill from './nav-rail-pill.vue';
import NavRailPanel from './nav-rail-panel.vue';

const shared = useSharedStore();
</script>

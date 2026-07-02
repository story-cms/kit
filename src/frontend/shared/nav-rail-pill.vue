<template>
  <aside
    class="glass-surface fixed inset-y-0 z-20 left-3 top-3 mx-auto max-h-min rounded-full transition-all duration-75"
  >
    <nav>
      <NavRailToolbar variant="pill" />
    </nav>
  </aside>
</template>

<script setup lang="ts">
import NavRailToolbar from './nav-rail-toolbar.vue';
</script>

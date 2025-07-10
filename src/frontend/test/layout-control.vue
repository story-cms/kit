<template>
  <div>
    <HstButton color="primary" class="htw-p-2 bg-emerald-500" @click="toggle">
      Main Under Header {{ shared.isMainUnderHeader }}
    </HstButton>
  </div>
</template>

<script setup lang="ts">
import { useSharedStore } from '../../store';

const shared = useSharedStore();

const toggle = () => {
  shared.isMainUnderHeader = !shared.isMainUnderHeader;
};
</script>

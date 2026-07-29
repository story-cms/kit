<template>
  <footer>
    <div class="mx-auto max-w-7xl pb-10 pt-20">
      <div class="flex flex-col items-center justify-center">
        <div class="flex items-center gap-x-2">
          <Icon name="studio-logo" />
          <span
            class="rounded-full border border-studio-forest px-2 py-px text-[10px] leading-4 text-studio-forest"
            >{{ version }}</span
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Icon from './icon.vue';
import { version } from '../../../package.json';
</script>

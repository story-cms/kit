<template>
  <header
    class="box-border w-full rounded-xl border border-white bg-white bg-white/50 px-4 py-6 shadow-[0_4px_50px_rgba(16,47,53,0.05)] backdrop-blur-[20px]"
  >
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2
          class="font-inter text-xs font-medium uppercase leading-4 tracking-[0.3px] text-[#6A7282]"
        >
          {{ title }}
        </h2>
        <p
          v-if="subtitle"
          class="text-xl font-semibold leading-7 tracking-[-0.45px] text-[#182E33]"
        >
          {{ subtitle }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <StudioButton label="Cancel" variant="outline" @click="emit('cancel')" />
        <StudioButton label="Request content update" @click="emit('submit')">
          <Plus class="size-6" />
        </StudioButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Plus } from '@lucide/vue';
import StudioButton from './studio-button.vue';

defineProps<{
  title: string;
  subtitle?: string;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'submit'): void;
}>();
</script>

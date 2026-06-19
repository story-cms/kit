<template>
  <header
    class="box-border w-full rounded-xl border border-white bg-white bg-white/50 px-4 py-6 shadow-[0_4px_50px_rgba(16,47,53,0.05)] backdrop-blur-[20px]"
  >
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="font-dmsans">
        <h2
          class="text-xs font-medium uppercase leading-4 tracking-[0.3px] text-[#6A7282]"
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
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="mt-6">
      <slot name="controls"></slot>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>

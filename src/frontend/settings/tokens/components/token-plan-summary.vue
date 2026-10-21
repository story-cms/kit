<template>
  <section class="rounded-xl bg-white p-6 shadow-sm">
    <div class="flex flex-wrap items-start justify-between gap-6">
      <div>
        <p class="text-sm/5 font-normal leading-5 text-gray-500">Current plan</p>
        <h3 class="text-2xl font-bold leading-8 text-black">Starter Plan</h3>
        <p class="mt-1 text-sm/5 font-normal leading-5 text-gray-500">
          6,240 / 10,000 tokens remaining. Billing cycle renews on 15 Mar 2026.
        </p>
      </div>
      <StudioButton label="Buy More Tokens" variant="primary" @click="emit('buy-tokens')" />
    </div>

    <div class="mt-6 rounded-lg bg-gray-50 p-4">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500">Token usage</span>
        <span class="font-semibold text-black">62% used</span>
      </div>
      <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div class="h-full w-[62%] rounded-full bg-studio-dark" />
      </div>
      <div class="mt-2 flex items-center justify-between text-sm text-gray-500">
        <span>3,760 tokens consumed</span>
        <span>6,240 remaining</span>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="rounded-lg bg-gray-50 p-4">
        <p class="text-sm text-gray-500">Billing cycle</p>
        <p class="font-semibold text-black">01 Mar 2026 — 31 Mar 2026</p>
      </div>
      <div class="rounded-lg bg-gray-50 p-4">
        <p class="text-sm text-gray-500">Renewal date</p>
        <p class="font-semibold text-black">01 Apr 2026</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Placeholder content: no plan/quota/billing-cycle model exists yet. Wire this up to real
// data once one does.
import StudioButton from '../../../shared/studio-button.vue';

const emit = defineEmits<{
  'buy-tokens': [];
}>();
</script>

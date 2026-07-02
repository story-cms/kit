<template>
  <header
    ref="header"
    :class="[
      'sticky top-3 z-10 box-border w-full shrink-0 rounded-xl border border-white bg-white/50 shadow-[0_4px_50px_rgba(16,47,53,0.05)] backdrop-blur-[20px]',
      shared.hasFeedback ? 'flex items-center justify-center' : 'px-4 py-6',
    ]"
  >
    <template v-if="!shared.hasFeedback">
      <slot v-if="$slots.header" name="header" />
      <template v-else>
        <div class="flex items-center justify-between gap-4">
          <div class="font-dmsans min-w-0 flex-1">
            <h2
              v-if="title"
              class="text-xs font-medium uppercase leading-4 tracking-[0.3px] text-[#6A7282]"
            >
              {{ title }}
            </h2>
            <p
              v-if="subtitle"
              class="truncate text-xl font-semibold leading-7 tracking-[-0.45px] text-[#182E33]"
              :title="subtitle"
            >
              {{ subtitle }}
            </p>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <slot name="actions" />
          </div>
        </div>
        <div v-if="$slots.controls" class="mt-6">
          <slot name="controls" />
        </div>
      </template>
    </template>
    <MessageCentre
      v-else
      :response="shared.messageCentre.response"
      :message="shared.messageCentre.message"
      :description="shared.messageCentre.description"
    />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSharedStore } from '../store';
import MessageCentre from './message-centre.vue';

defineProps<{
  title?: string;
  subtitle?: string;
}>();

const shared = useSharedStore();
const header = ref<HTMLElement | null>(null);

defineExpose({ header });
</script>

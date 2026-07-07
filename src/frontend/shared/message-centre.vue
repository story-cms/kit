<template>
  <div
    class="flex items-center justify-center"
    :style="{
      height: `${shared.headerHeight}px`,
    }"
  >
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div v-if="message" class="flex flex-col items-center">
        <div class="flex w-full flex-col items-center justify-center gap-4">
          <component
            :is="responseConfig.icon"
            :class="responseConfig.iconClass"
            aria-hidden="true"
          />
          <p class="max-w-full text-center font-dmsans text-xl font-semibold leading-4">
            {{ message }}
          </p>
        </div>
        <p
          v-if="description"
          class="mt-4 text-center font-dmsans text-sm font-normal leading-5"
        >
          {{ description }}
        </p>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { computed, type Component } from 'vue';
import { BadgeCheck, Check, CircleAlert, Info } from '@lucide/vue';
import { ResponseStatus } from '../../types';
import { useSharedStore } from '../store';

const shared = useSharedStore();

const props = defineProps<{
  response: ResponseStatus;
  message: string;
  description?: string;
}>();

const RESPONSE_CONFIG: Record<
  Exclude<ResponseStatus, ResponseStatus.None>,
  { icon: Component; iconClass: string }
> = {
  [ResponseStatus.Failure]: {
    icon: CircleAlert,
    iconClass: 'inline-flex size-6 shrink-0 text-red-500',
  },
  [ResponseStatus.Confirmation]: {
    icon: Check,
    iconClass: 'inline-flex size-6 shrink-0 text-blue-500',
  },
  [ResponseStatus.Accomplishment]: {
    icon: BadgeCheck,
    iconClass: 'inline-flex size-6 shrink-0 text-green-500',
  },
  [ResponseStatus.Neutral]: {
    icon: Info,
    iconClass: 'inline-flex size-6 shrink-0 text-yellow-500',
  },
};

const responseConfig = computed(
  () =>
    RESPONSE_CONFIG[props.response as Exclude<ResponseStatus, ResponseStatus.None>] ??
    RESPONSE_CONFIG[ResponseStatus.Neutral],
);
</script>

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
      <div
        v-if="message"
        class="flex flex-col items-center text-center text-sm font-medium leading-4"
      >
        <div class="flex w-full items-center justify-center gap-x-6">
          <Icon :name="responseConfig.icon" :class="responseConfig.iconClass" />
          <p class="max-w-full">{{ message }}</p>
        </div>
        <p
          v-if="description"
          class="mt-2 text-center font-['Inter'] text-sm font-normal leading-5"
        >
          {{ description }}
        </p>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Icon from './icon.vue';
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
  { icon: string; iconClass: string }
> = {
  [ResponseStatus.Failure]: {
    icon: 'exclamation',
    iconClass: 'inline-flex h-6 w-6 items-center text-red-500',
  },
  [ResponseStatus.Confirmation]: {
    icon: 'check',
    iconClass: 'inline-flex h-6 w-6 items-center text-blue-500',
  },
  [ResponseStatus.Accomplishment]: {
    icon: 'badge-check',
    iconClass: 'inline-flex h-6 w-6 items-center text-green-500',
  },
  [ResponseStatus.Neutral]: {
    icon: 'information-circle',
    iconClass: 'inline-flex h-6 w-6 items-center text-yellow-500',
  },
};

const responseConfig = computed(
  () =>
    RESPONSE_CONFIG[props.response as Exclude<ResponseStatus, ResponseStatus.None>] ??
    RESPONSE_CONFIG[ResponseStatus.Neutral],
);
</script>

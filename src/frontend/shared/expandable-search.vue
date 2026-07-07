<template>
  <div ref="root" class="flex shrink-0 items-center">
    <transition
      mode="out-in"
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 transform scale-95"
      enter-to-class="opacity-100 transform scale-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 transform scale-100"
      leave-to-class="opacity-0 transform scale-95"
    >
      <div
        v-if="isExpanded"
        key="input"
        class="relative shrink-0 w-56 rounded-full border border-gray-300 bg-white"
        :class="{ 'min-w-[14rem]': isForcedOpen && !hasRoom }"
      >
        <Search
          class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          ref="inputRef"
          type="text"
          name="search"
          :value="modelValue"
          :placeholder="placeholder"
          class="block w-full rounded-full border-0 bg-transparent py-2 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="onInput"
          @focus="resetIdleTimer"
          @keydown.escape="onEscape"
        />
        <button
          v-if="showClearButton"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Clear search"
          @click="onClear"
        >
          <X class="size-4" aria-hidden="true" />
        </button>
      </div>
      <button
        v-else
        key="icon"
        type="button"
        class="shrink-0 p-0 text-gray-500 transition-colors hover:text-gray-700"
        aria-label="Search"
        :aria-expanded="isForcedOpen"
        @click.stop="openSearch"
      >
        <Search class="size-4" aria-hidden="true" />
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { Search, X } from '@lucide/vue';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

const IDLE_MS = 5000;

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    expandAt?: number;
    clearOnCollapse?: boolean;
  }>(),
  {
    placeholder: 'Search',
    expandAt: 160,
    clearOnCollapse: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'collapse'): void;
}>();

const root = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const containerWidth = ref(0);
const isForcedOpen = ref(false);

let resizeObserver: ResizeObserver | null = null;
let idleTimer: ReturnType<typeof setTimeout> | null = null;

const hasRoom = computed(() => containerWidth.value >= props.expandAt);
const isExpanded = computed(() => hasRoom.value || isForcedOpen.value);
const showClearButton = computed(
  () => props.modelValue.length > 0 || (isForcedOpen.value && !hasRoom.value),
);

watch(hasRoom, (room) => {
  if (room) {
    isForcedOpen.value = false;
    clearIdleTimer();
  }
});

const clearIdleTimer = () => {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = null;
};

const resetIdleTimer = () => {
  clearIdleTimer();
  if (!isForcedOpen.value || hasRoom.value) return;
  idleTimer = setTimeout(collapse, IDLE_MS);
};

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
  resetIdleTimer();
};

const openSearch = async (event: MouseEvent) => {
  event.stopPropagation();
  isForcedOpen.value = true;
  await nextTick();
  inputRef.value?.focus();
  resetIdleTimer();
};

const collapse = () => {
  if (!isForcedOpen.value) return;

  clearIdleTimer();
  isForcedOpen.value = false;

  if (props.clearOnCollapse) {
    emit('update:modelValue', '');
  }

  emit('collapse');
};

const onClear = () => {
  if (props.modelValue.length > 0) {
    emit('update:modelValue', '');
  }

  if (isForcedOpen.value && !hasRoom.value) {
    collapse();
  }
};

const onEscape = () => {
  if (isForcedOpen.value && !hasRoom.value) {
    collapse();
  }
};

const onClickOutside = (event: MouseEvent) => {
  if (!isForcedOpen.value || hasRoom.value) return;

  const target = event.target as Node;
  if (root.value && !root.value.contains(target)) {
    collapse();
  }
};

onMounted(() => {
  const observeTarget = root.value?.parentElement ?? root.value;

  if (observeTarget) {
    resizeObserver = new ResizeObserver((entries) => {
      containerWidth.value = entries[0]?.contentRect.width ?? 0;
    });
    resizeObserver.observe(observeTarget);
    containerWidth.value = observeTarget.getBoundingClientRect().width;
  }

  document.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  document.removeEventListener('click', onClickOutside);
  clearIdleTimer();
});
</script>

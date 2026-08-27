<template>
  <div
    class="relative my-2 list-none rounded-xl border border-gray-200 p-0"
    :class="{
      'h-full': stretchForAlignment,
      'self-start': translationMode && !expanded,
    }"
    :data-translation-block-index="translationMode ? blockIndex : undefined"
    :data-translation-block-side="
      translationMode ? (readOnly ? 'source' : 'translation') : undefined
    "
    ref="cardEl"
    :draggable="isDragHandleActive"
    @dragstart="onDragStart"
    @dragover.prevent
    @drop="onDrop"
    @dragend="onDragEnd"
  >
    <div
      class="rounded-xl bg-white"
      :class="{ 'flex h-full flex-col': stretchForAlignment }"
    >
      <div
        :class="[
          'flex items-center justify-between gap-3 overflow-hidden px-4 py-3',
          { 'border-b border-gray-100': expanded },
        ]"
      >
        <div class="flex min-w-0 items-center gap-3">
          <button
            v-if="canDrag"
            type="button"
            class="cursor-move text-gray-400"
            :aria-label="`Reorder ${kindLabel} block`"
            @pointerdown="onHandlePointerDown"
          >
            <GripVertical class="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="inline-flex min-w-0 items-center gap-2 text-left text-sm font-semibold text-gray-800"
            @click="emit('toggle')"
          >
            <component
              :is="kindIcon"
              class="size-4 shrink-0 text-gray-700"
              aria-hidden="true"
            />
            <span class="truncate">{{ title }}</span>
            <div
              v-if="presenterVisible"
              class="flex shrink-0 items-center rounded bg-studio-yellow p-[5px]"
            >
              <Monitor class="size-[14px] text-studio-forest" aria-hidden="true" />
            </div>
            <div
              v-if="personalVisible"
              class="flex shrink-0 items-center rounded bg-studio-lime p-[5px]"
            >
              <User class="size-[14px] text-studio-forest" aria-hidden="true" />
            </div>
            <div
              v-if="navigationVisible"
              class="flex shrink-0 items-center rounded bg-studio-forest p-[5px]"
            >
              <Send class="size-[14px] text-white" aria-hidden="true" />
            </div>
          </button>
        </div>
        <div class="flex items-center justify-center gap-1">
          <div
            v-if="hasError"
            class="text-error"
            role="img"
            :title="errorMessage"
            :aria-label="errorMessage || 'This block has an error'"
          >
            <CircleAlert class="size-5" aria-hidden="true" />
          </div>
          <button
            v-if="!readOnly && !translationMode"
            type="button"
            class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            :aria-label="`Delete ${kindLabel} block`"
            @click="emit('delete')"
          >
            <Trash2 class="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            :aria-label="
              expanded ? `Collapse ${kindLabel} block` : `Expand ${kindLabel} block`
            "
            @click="emit('toggle')"
          >
            <ChevronDown
              class="size-4 origin-center transition-transform duration-200 ease-out"
              :class="{ 'rotate-180': expanded }"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <div v-if="expanded" class="space-y-6 p-6" :class="{ 'flex-1': stretchForAlignment }">
        <slot />
      </div>
      <div
        v-if="expanded && $slots.footer"
        class="rounded-b-xl border-t border-gray-200 bg-gray-50 px-4 py-3"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, type Component } from 'vue';
import {
  ChevronDown,
  CircleAlert,
  GripVertical,
  Monitor,
  Send,
  Trash2,
  User,
} from '@lucide/vue';

const props = withDefaults(
  defineProps<{
    title: string;
    kindIcon: Component;
    expanded: boolean;
    presenterVisible: boolean;
    personalVisible: boolean;
    navigationVisible: boolean;
    kindLabel: string;
    hasError?: boolean;
    errorMessage?: string;
    readOnly?: boolean;
    translationMode?: boolean;
    blockIndex?: number;
  }>(),
  {
    readOnly: false,
    translationMode: false,
    blockIndex: undefined,
  },
);

const stretchForAlignment = computed(() => props.translationMode && props.expanded);
const canDrag = computed(() => !props.readOnly && !props.translationMode);
const cardEl = ref<HTMLElement | null>(null);
const isDragHandleActive = ref(false);
const isDragging = ref(false);

const emit = defineEmits<{
  toggle: [];
  delete: [];
  dragstart: [];
  drop: [];
  dragend: [];
}>();

const setCardDraggable = (value: boolean) => {
  isDragHandleActive.value = value;
  if (cardEl.value) cardEl.value.draggable = value;
};

const clearDragHandle = () => {
  window.removeEventListener('pointerup', onWindowPointerUp);
  setCardDraggable(false);
  isDragging.value = false;
};

const onWindowPointerUp = () => {
  window.removeEventListener('pointerup', onWindowPointerUp);
  if (isDragging.value) return;
  requestAnimationFrame(() => {
    if (!isDragging.value) setCardDraggable(false);
  });
};

const onHandlePointerDown = () => {
  if (!canDrag.value) return;
  setCardDraggable(true);
  window.addEventListener('pointerup', onWindowPointerUp);
};

const onDragStart = (event: DragEvent) => {
  if (!isDragHandleActive.value) {
    event.preventDefault();
    return;
  }
  isDragging.value = true;
  event.dataTransfer?.setData('text/plain', 'block');
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  emit('dragstart');
};

const onDrop = () => {
  if (!canDrag.value) return;
  emit('drop');
};

const onDragEnd = () => {
  const wasDragging = isDragging.value;
  clearDragHandle();
  if (!wasDragging || !canDrag.value) return;
  emit('dragend');
};

onUnmounted(clearDragHandle);
</script>

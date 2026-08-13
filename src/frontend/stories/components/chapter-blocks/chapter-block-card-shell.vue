<template>
  <div
    class="relative my-2 list-none rounded-xl border border-gray-200 p-0"
    draggable="true"
    @dragstart="emit('dragstart')"
    @dragover.prevent
    @drop="emit('drop')"
    @dragend="emit('dragend')"
  >
    <div class="rounded-xl bg-white">
      <div
        :class="[
          'flex items-center justify-between gap-3 overflow-hidden px-4 py-3',
          { 'border-b border-gray-100': expanded },
        ]"
      >
        <div class="flex min-w-0 items-center gap-3">
          <button
            type="button"
            class="cursor-move text-gray-400"
            :aria-label="`Reorder ${kindLabel} block`"
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
          </button>
        </div>
        <div class="flex items-center justify-center gap-1">
          <button
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

      <div v-if="expanded" class="space-y-6 p-6">
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
import type { Component } from 'vue';
import { ChevronDown, GripVertical, Monitor, Trash2, User } from '@lucide/vue';

defineProps<{
  title: string;
  kindIcon: Component;
  expanded: boolean;
  presenterVisible: boolean;
  personalVisible: boolean;
  kindLabel: string;
}>();

const emit = defineEmits<{
  toggle: [];
  delete: [];
  dragstart: [];
  drop: [];
  dragend: [];
}>();
</script>

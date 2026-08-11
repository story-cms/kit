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
            aria-label="Reorder scripture block"
          >
            <GripVertical class="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="inline-flex min-w-0 items-center gap-2 text-left text-sm font-semibold text-gray-800"
            @click="emit('toggle')"
          >
            <span class="truncate">{{ blockTitle }}</span>
            <div
              v-if="block.visibility.presenter"
              class="flex shrink-0 items-center rounded bg-studio-yellow p-[5px]"
            >
              <Monitor class="size-[14px] text-studio-forest" aria-hidden="true" />
            </div>
            <div
              v-if="block.visibility.personal"
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
            aria-label="Delete scripture block"
            @click="emit('delete')"
          >
            <Trash2 class="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            :aria-label="expanded ? 'Collapse scripture block' : 'Expand scripture block'"
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
        <div>
          <label :for="`${block.id}-block-name`" class="input-label">Block Name</label>
          <input
            :id="`${block.id}-block-name`"
            type="text"
            :value="block.blockName"
            placeholder="e.g., Opening Passage, Key Verse"
            class="input-field mt-[2px]"
            @input="updateField('blockName', ($event.target as HTMLInputElement).value)"
          />
          <p class="mt-1 text-sm italic text-gray-500">
            This becomes the collapsible section name
          </p>
        </div>

        <BlockScriptureField
          :model-value="block.scripture"
          :block-id="block.id"
          label="Scripture"
          @update:model-value="updateField('scripture', $event)"
        />

        <section class="border-gray-[#E5E7EB] rounded-xl border bg-gray-50 p-4">
          <legend class="input-label mb-3">Visibility</legend>
          <div class="flex items-center gap-6">
            <label
              v-for="option in visibilityOptions"
              :key="option.key"
              class="flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                class="size-[22px] rounded border-gray-300 text-studio-forest focus:ring-blue-500"
                :checked="block.visibility[option.key]"
                @change="
                  updateVisibility(
                    option.key,
                    ($event.target as HTMLInputElement).checked,
                  )
                "
              />
              <div
                class="flex items-center gap-2 rounded"
                :class="option.iconBackgroundClass"
              >
                <component
                  :is="option.icon"
                  class="size-[14px] text-studio-forest"
                  aria-hidden="true"
                />
              </div>
              <span class="text-sm font-medium text-gray-900">{{ option.label }}</span>
            </label>
          </div>
        </section>

        <div
          v-if="block.showLeadersNotes"
          class="rounded-xl border border-studio-yellow/60 bg-studio-yellow/30 p-4"
        >
          <div class="mb-3 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <Crown class="size-[18px] text-studio-forest" aria-hidden="true" />
              <span class="text-sm font-semibold text-studio-forest">Leaders Notes</span>
              <span
                class="rounded-full bg-studio-yellow px-2 py-0.5 text-xs font-medium text-studio-forest"
              >
                Leaders Only
              </span>
            </div>
            <button
              type="button"
              class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label="Remove leaders notes"
              @click="updateField('showLeadersNotes', false)"
            >
              <Trash2 class="size-4" aria-hidden="true" />
            </button>
          </div>
          <textarea
            :value="block.leadersNotes"
            rows="3"
            placeholder="Add guidance and notes for leaders..."
            class="input-field min-h-[80px] resize-y"
            @input="
              updateField('leadersNotes', ($event.target as HTMLTextAreaElement).value)
            "
          />
        </div>

        <button
          v-else
          type="button"
          class="text-sm font-medium text-studio-forest underline-offset-2 hover:underline"
          @click="updateField('showLeadersNotes', true)"
        >
          Add Leaders Notes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import {
  ChevronDown,
  Crown,
  EyeOff,
  GripVertical,
  Monitor,
  Trash2,
  User,
} from '@lucide/vue';

import type { BlockVisibility, StoryScriptureBlock } from '../../../types';
import BlockScriptureField from './block-scripture-field.vue';

const props = defineProps<{
  block: StoryScriptureBlock;
  expanded: boolean;
}>();

const emit = defineEmits<{
  'update:block': [block: StoryScriptureBlock];
  delete: [];
  toggle: [];
  dragstart: [];
  drop: [];
  dragend: [];
}>();

const blockTitle = computed(() =>
  props.block.blockName.trim() ? props.block.blockName.trim() : 'New Scripture Block',
);

const updateField = <K extends keyof StoryScriptureBlock>(
  key: K,
  value: StoryScriptureBlock[K],
) => {
  emit('update:block', { ...props.block, [key]: value });
};

const updateVisibility = (key: keyof BlockVisibility, checked: boolean) => {
  emit('update:block', {
    ...props.block,
    visibility: { ...props.block.visibility, [key]: checked },
  });
};

const visibilityOptions: {
  key: keyof BlockVisibility;
  label: string;
  icon: Component;
  iconBackgroundClass: string;
}[] = [
  {
    key: 'presenter',
    label: 'Presenter',
    icon: Monitor,
    iconBackgroundClass: 'bg-studio-yellow p-[5px]',
  },
  {
    key: 'personal',
    label: 'Personal',
    icon: User,
    iconBackgroundClass: 'bg-studio-lime p-[5px]',
  },
  {
    key: 'hidden',
    label: 'Hidden',
    icon: EyeOff,
    iconBackgroundClass: 'bg-red-200 p-[5px]',
  },
];
</script>

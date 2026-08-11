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
            aria-label="Reorder title block"
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
            aria-label="Delete title block"
            @click="emit('delete')"
          >
            <Trash2 class="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            :aria-label="expanded ? 'Collapse title block' : 'Expand title block'"
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
            placeholder="e.g., Session Title, Chapter Heading"
            class="input-field mt-[2px]"
            @input="updateField('blockName', ($event.target as HTMLInputElement).value)"
          />
          <p class="mt-1 text-sm italic text-gray-500">
            This becomes the collapsible section name
          </p>
        </div>

        <div>
          <label :for="`${block.id}-title`" class="input-label">Title</label>
          <input
            :id="`${block.id}-title`"
            type="text"
            :value="block.title"
            placeholder="e.g., The Gospel of John"
            class="input-field mt-[2px]"
            @input="updateField('title', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <RichListbox
          :model-value="block.style"
          label="Style"
          :options="styleOptions"
          @update:model-value="updateField('style', $event)"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import {
  ChevronDown,
  EyeOff,
  GripVertical,
  Monitor,
  Star,
  Trash2,
  User,
} from '@lucide/vue';

import type { BlockVisibility, StoryTitleBlock } from '../../../types';
import RichListbox from '../../shared/rich-listbox.vue';

const props = defineProps<{
  block: StoryTitleBlock;
  expanded: boolean;
}>();

const emit = defineEmits<{
  'update:block': [block: StoryTitleBlock];
  delete: [];
  toggle: [];
  dragstart: [];
  drop: [];
  dragend: [];
}>();

const blockTitle = computed(() =>
  props.block.blockName.trim() ? props.block.blockName.trim() : 'New Title Block',
);

const updateField = <K extends keyof StoryTitleBlock>(
  key: K,
  value: StoryTitleBlock[K],
) => {
  emit('update:block', { ...props.block, [key]: value });
};

const updateVisibility = (key: keyof BlockVisibility, checked: boolean) => {
  emit('update:block', {
    ...props.block,
    visibility: { ...props.block.visibility, [key]: checked },
  });
};

const styleOptions: {
  value: string;
  label: string;
  description: string;
  icon: Component;
}[] = [
  {
    value: 'default',
    label: 'Default',
    description: 'Standard visual weight',
    icon: Star,
  },
  {
    value: 'emphasis',
    label: 'Emphasis',
    description: 'Draws more attention',
    icon: Star,
  },
  {
    value: 'subtle',
    label: 'Subtle',
    description: 'Lighter visual treatment',
    icon: Star,
  },
];

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

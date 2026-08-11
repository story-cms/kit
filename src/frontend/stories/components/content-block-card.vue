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
            aria-label="Reorder content block"
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
            aria-label="Delete content block"
            @click="emit('delete')"
          >
            <Trash2 class="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            :aria-label="expanded ? 'Collapse content block' : 'Expand content block'"
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
            placeholder="e.g., Summary, Introduction, Overview"
            class="input-field mt-[2px]"
            @input="updateField('blockName', ($event.target as HTMLInputElement).value)"
          />
          <p class="mt-1 text-sm italic text-gray-500">
            This becomes the collapsible section name
          </p>
        </div>

        <div>
          <label :for="`${block.id}-display-name`" class="input-label"
            >Display Name</label
          >
          <input
            :id="`${block.id}-display-name`"
            type="text"
            :value="block.displayName"
            placeholder="e.g., Session Summary"
            class="input-field mt-[2px]"
            @input="updateField('displayName', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <RichListbox
          :model-value="block.blockRole"
          label="Block Role"
          :options="blockRoleOptions"
          @update:model-value="updateField('blockRole', $event)"
        />

        <RichListbox
          :model-value="block.style"
          label="Style"
          :options="styleOptions"
          @update:model-value="updateField('style', $event)"
        />

        <RichListbox
          :model-value="block.blockType"
          label="Block Type"
          :options="blockTypeOptions"
          @update:model-value="setBlockType"
        />

        <BlockRichTextEditor
          v-if="block.blockType === 'text'"
          v-model="contentModel"
          label="Text Content"
          placeholder="Enter your content..."
        />

        <div v-if="block.blockType === 'url'">
          <label :for="`${block.id}-url`" class="input-label">URL</label>
          <input
            :id="`${block.id}-url`"
            type="url"
            :value="block.url ?? ''"
            placeholder="https://..."
            class="input-field mt-[2px]"
            @input="updateField('url', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <BlockVideoField
          v-if="block.blockType === 'video'"
          :model-value="block.video ?? { url: null }"
          :collection-id="videoCollectionId ?? ''"
          :block-id="block.id"
          label="Video"
          @update:model-value="updateField('video', $event)"
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
  BookOpen,
  ChevronDown,
  Crown,
  ExternalLink,
  EyeOff,
  FileText,
  GripVertical,
  Monitor,
  Star,
  Trash2,
  User,
  Video,
} from '@lucide/vue';

import type { BlockVisibility, ResourceType, StoryContentBlock } from '../../../types';
import RichListbox from '../../shared/rich-listbox.vue';
import BlockRichTextEditor from './block-rich-text-editor.vue';
import BlockVideoField from './block-video-field.vue';

const props = defineProps<{
  block: StoryContentBlock;
  expanded: boolean;
  videoCollectionId?: string;
}>();

const emit = defineEmits<{
  'update:block': [block: StoryContentBlock];
  delete: [];
  toggle: [];
  dragstart: [];
  drop: [];
  dragend: [];
}>();

const blockTitle = computed(() =>
  props.block.blockName.trim() ? props.block.blockName.trim() : 'New Content Block',
);

const contentModel = computed({
  get: () => props.block.content,
  set: (value: string) => updateField('content', value),
});

const updateField = <K extends keyof StoryContentBlock>(
  key: K,
  value: StoryContentBlock[K],
) => {
  emit('update:block', { ...props.block, [key]: value });
};

const updateVisibility = (key: keyof BlockVisibility, checked: boolean) => {
  emit('update:block', {
    ...props.block,
    visibility: { ...props.block.visibility, [key]: checked },
  });
};

const setBlockType = (type: string) => {
  const blockType = type as ResourceType;
  const next: StoryContentBlock = { ...props.block, blockType };

  if (blockType !== 'url') {
    next.url = '';
  } else if (next.url === undefined) {
    next.url = '';
  }

  if (blockType !== 'video') {
    next.video = { url: null };
  } else if (!next.video) {
    next.video = { url: null };
  }

  if (blockType !== 'text') {
    next.content = '';
  } else if (next.content === undefined) {
    next.content = '';
  }

  emit('update:block', next);
};

const blockRoleOptions: {
  value: string;
  label: string;
  description: string;
  icon: Component;
}[] = [
  {
    value: 'summary',
    label: 'Summary',
    description: 'Recap or overview of the session',
    icon: BookOpen,
  },
  {
    value: 'introduction',
    label: 'Introduction',
    description: 'Opening context for the content',
    icon: BookOpen,
  },
  {
    value: 'reflection',
    label: 'Reflection',
    description: 'Prompt for personal reflection',
    icon: BookOpen,
  },
];

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

const blockTypeOptions: {
  value: ResourceType;
  label: string;
  description: string;
  icon: Component;
}[] = [
  {
    value: 'text',
    label: 'Text',
    description: 'Rich formatted text content',
    icon: FileText,
  },
  {
    value: 'url',
    label: 'URL',
    description: 'Link to an external website or resource',
    icon: ExternalLink,
  },
  {
    value: 'video',
    label: 'Video',
    description: 'Upload a video file',
    icon: Video,
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

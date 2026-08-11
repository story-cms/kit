<template>
  <ChapterBlockCardShell
    :title="blockTitle"
    :expanded="expanded"
    :presenter-visible="block.visibility.presenter"
    :personal-visible="block.visibility.personal"
    kind-label="content"
    @toggle="emit('toggle')"
    @delete="emit('delete')"
    @dragstart="emit('dragstart')"
    @drop="emit('drop')"
    @dragend="emit('dragend')"
  >
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
      <label :for="`${block.id}-display-name`" class="input-label">Display Name</label>
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

    <ChapterBlockRichTextEditor
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

    <ChapterBlockVideoField
      v-if="block.blockType === 'video'"
      :model-value="block.video ?? { url: null }"
      :collection-id="videoCollectionId ?? ''"
      :block-id="block.id"
      label="Video"
      @update:model-value="updateField('video', $event)"
    />

    <ChapterBlockVisibility v-model="visibilityModel" />

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
        @input="updateField('leadersNotes', ($event.target as HTMLTextAreaElement).value)"
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
  </ChapterBlockCardShell>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import {
  BookOpen,
  Crown,
  ExternalLink,
  FileText,
  Star,
  Trash2,
  Video,
} from '@lucide/vue';

import type { ResourceType, ChapterContentBlock } from '../../../../types';
import RichListbox from '../../../shared/rich-listbox.vue';
import ChapterBlockCardShell from './chapter-block-card-shell.vue';
import ChapterBlockRichTextEditor from './chapter-block-rich-text-editor.vue';
import ChapterBlockVideoField from './chapter-block-video-field.vue';
import ChapterBlockVisibility from './chapter-block-visibility.vue';

const props = defineProps<{
  block: ChapterContentBlock;
  expanded: boolean;
  videoCollectionId?: string;
}>();

const emit = defineEmits<{
  'update:block': [block: ChapterContentBlock];
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

const visibilityModel = computed({
  get: () => props.block.visibility,
  set: (value: ChapterContentBlock['visibility']) => updateField('visibility', value),
});

const updateField = <K extends keyof ChapterContentBlock>(
  key: K,
  value: ChapterContentBlock[K],
) => {
  emit('update:block', { ...props.block, [key]: value });
};

const setBlockType = (type: string) => {
  const blockType = type as ResourceType;
  const next: ChapterContentBlock = { ...props.block, blockType };

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
</script>

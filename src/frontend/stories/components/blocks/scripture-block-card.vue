<template>
  <BlockCardShell
    :title="blockTitle"
    :kind-icon="BookMarked"
    :expanded="expanded"
    :has-error="hasError"
    :presenter-visible="block.visibility.presenter && !block.visibility.hidden"
    :personal-visible="block.visibility.personal && !block.visibility.hidden"
    :navigation-visible="block.visibility.inNavigation && !block.visibility.hidden"
    kind-label="scripture"
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
        placeholder="e.g., Opening Passage, Key Verse"
        class="input-field mt-[2px]"
        :class="{ 'border-error': fieldHasError('blockName') }"
        @input="updateField('blockName', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="fieldHasError('blockName')" class="text-sm text-error">
        {{ fieldMessages('blockName')[0] }}
      </p>
      <p v-else class="mt-1 text-sm italic text-gray-500">
        This becomes the collapsible section name
      </p>
    </div>

    <div>
      <label :for="`${block.id}-display-name`" class="input-label">Display Name</label>
      <input
        :id="`${block.id}-display-name`"
        type="text"
        :value="block.displayName"
        placeholder="e.g., Opening Scripture"
        class="input-field mt-[2px]"
        :class="{ 'border-error': fieldHasError('displayName') }"
        @input="updateField('displayName', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="fieldHasError('displayName')" class="text-sm text-error">
        {{ fieldMessages('displayName')[0] }}
      </p>
    </div>

    <BlockScriptureField
      :model-value="block.scripture"
      :block-index="blockIndex"
      label="Scripture"
      @update:model-value="updateField('scripture', $event)"
    />

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

    <AddLeadersNotesButton
      v-else
      class="mt-6"
      @click="updateField('showLeadersNotes', true)"
    />

    <template #footer>
      <BlockVisibility v-model="visibilityModel" />
    </template>
  </BlockCardShell>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BookMarked, Crown, Trash2 } from '@lucide/vue';

import type { ChapterScriptureBlock } from '../../../../types';
import BlockCardShell from './block-card-shell.vue';
import AddLeadersNotesButton from './add-leaders-notes-button.vue';
import BlockScriptureField from './block-scripture-field.vue';
import BlockVisibility from './block-visibility.vue';
import { useBlockFieldErrors } from './use-block-field-errors';

const props = defineProps<{
  block: ChapterScriptureBlock;
  blockIndex: number;
  expanded: boolean;
}>();

const emit = defineEmits<{
  'update:block': [block: ChapterScriptureBlock];
  delete: [];
  toggle: [];
  dragstart: [];
  drop: [];
  dragend: [];
}>();

const { hasError, fieldMessages, fieldHasError } = useBlockFieldErrors(props.blockIndex);

const blockTitle = computed(() =>
  props.block.blockName.trim() ? props.block.blockName.trim() : 'New Scripture Block',
);

const visibilityModel = computed({
  get: () => props.block.visibility,
  set: (value: ChapterScriptureBlock['visibility']) => updateField('visibility', value),
});

const updateField = <K extends keyof ChapterScriptureBlock>(
  key: K,
  value: ChapterScriptureBlock[K],
) => {
  emit('update:block', { ...props.block, [key]: value });
};
</script>

<template>
  <BlockCardShell
    :title="blockTitle"
    :kind-icon="PencilLine"
    :expanded="expanded"
    :has-error="hasError && !readOnly"
    :presenter-visible="block.visibility.presenter && !block.visibility.hidden"
    :personal-visible="block.visibility.personal && !block.visibility.hidden"
    :navigation-visible="block.visibility.inNavigation && !block.visibility.hidden"
    kind-label="title"
    :read-only="readOnly"
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
        placeholder="e.g., Session Title, Chapter Heading"
        class="input-field mt-[2px]"
        :class="{
          'border-error': fieldHasError('blockName'),
          'text-gray-600 shadow-none': isFieldReadOnly('blockName'),
        }"
        :readonly="isFieldReadOnly('blockName')"
        @input="updateField('blockName', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="fieldHasError('blockName') && !readOnly" class="text-sm text-error">
        {{ fieldMessages('blockName')[0] }}
      </p>
      <p v-else-if="!readOnly" class="mt-1 text-sm italic text-gray-500">
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
        :class="{
          'border-error': fieldHasError('title'),
          'text-gray-600 shadow-none': isFieldReadOnly('title'),
        }"
        :readonly="isFieldReadOnly('title')"
        @input="updateField('title', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="fieldHasError('title') && !readOnly" class="text-sm text-error">
        {{ fieldMessages('title')[0] }}
      </p>
    </div>

    <div>
      <label :for="`${block.id}-subtitle`" class="input-label">Subtitle</label>
      <input
        :id="`${block.id}-subtitle`"
        type="text"
        :value="block.subtitle"
        placeholder="e.g., Session 1 of 12"
        class="input-field mt-[2px]"
        :class="{
          'border-error': fieldHasError('subtitle'),
          'text-gray-600 shadow-none': isFieldReadOnly('subtitle'),
        }"
        :readonly="isFieldReadOnly('subtitle')"
        @input="updateField('subtitle', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="fieldHasError('subtitle') && !readOnly" class="text-sm text-error">
        {{ fieldMessages('subtitle')[0] }}
      </p>
    </div>

    <BlockImageField
      :model-value="block.coverImage ?? ''"
      :block-index="blockIndex"
      label="Cover Image (Optional)"
      :read-only="isFieldReadOnly('coverImage')"
      @update:model-value="updateField('coverImage', $event)"
    />
    <div class="mt-4"></div>
    <template v-if="!readOnly && !translationMode" #footer>
      <BlockVisibility v-model="visibilityModel" />
    </template>
    <template v-else-if="translationMode && !readOnly" #footer>
      <BlockVisibility v-model="visibilityModel" :read-only="true" />
    </template>
    <template v-else-if="readOnly" #footer>
      <BlockVisibility v-model="visibilityModel" :read-only="true" />
    </template>
  </BlockCardShell>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PencilLine } from '@lucide/vue';

import type { ChapterTitleBlock } from '../../../../types';
import BlockCardShell from './block-card-shell.vue';
import BlockImageField from './block-image-field.vue';
import BlockVisibility from './block-visibility.vue';
import { useBlockFieldErrors } from './use-block-field-errors';

const props = withDefaults(
  defineProps<{
    block: ChapterTitleBlock;
    blockIndex: number;
    expanded: boolean;
    readOnly?: boolean;
    translationMode?: boolean;
  }>(),
  {
    readOnly: false,
    translationMode: false,
  },
);

const emit = defineEmits<{
  'update:block': [block: ChapterTitleBlock];
  delete: [];
  toggle: [];
  dragstart: [];
  drop: [];
  dragend: [];
}>();

const { hasError, fieldMessages, fieldHasError } = useBlockFieldErrors(props.blockIndex);

const blockTitle = computed(() =>
  props.block.blockName.trim() ? props.block.blockName.trim() : 'New Title Block',
);

const visibilityModel = computed({
  get: () => props.block.visibility,
  set: (value: ChapterTitleBlock['visibility']) => updateField('visibility', value),
});

const isFieldReadOnly = (field: 'blockName' | 'title' | 'subtitle' | 'coverImage') => {
  if (props.readOnly) return true;
  if (!props.translationMode) return false;
  return field === 'coverImage';
};

const updateField = <K extends keyof ChapterTitleBlock>(
  key: K,
  value: ChapterTitleBlock[K],
) => {
  if (props.readOnly) return;
  if (props.translationMode && key === 'coverImage') return;
  emit('update:block', { ...props.block, [key]: value });
};
</script>

<template>
  <BlockCardShell
    :title="blockTitle"
    :kind-icon="PencilLine"
    :expanded="expanded"
    :presenter-visible="block.visibility.presenter && !block.visibility.hidden"
    :personal-visible="block.visibility.personal && !block.visibility.hidden"
    :navigation-visible="block.visibility.inNavigation && !block.visibility.hidden"
    kind-label="title"
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

    <div>
      <label :for="`${block.id}-subtitle`" class="input-label">Subtitle</label>
      <input
        :id="`${block.id}-subtitle`"
        type="text"
        :value="block.subtitle"
        placeholder="e.g., Session 1 of 12"
        class="input-field mt-[2px]"
        @input="updateField('subtitle', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <BlockImageField
      :model-value="block.coverImage ?? ''"
      :block-id="block.id"
      label="Cover Image (Optional)"
      @update:model-value="updateField('coverImage', $event)"
    />
    <div class="mt-4"></div>
    <template #footer>
      <BlockVisibility v-model="visibilityModel" />
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

const props = defineProps<{
  block: ChapterTitleBlock;
  expanded: boolean;
}>();

const emit = defineEmits<{
  'update:block': [block: ChapterTitleBlock];
  delete: [];
  toggle: [];
  dragstart: [];
  drop: [];
  dragend: [];
}>();

const blockTitle = computed(() =>
  props.block.blockName.trim() ? props.block.blockName.trim() : 'New Title Block',
);

const visibilityModel = computed({
  get: () => props.block.visibility,
  set: (value: ChapterTitleBlock['visibility']) => updateField('visibility', value),
});

const updateField = <K extends keyof ChapterTitleBlock>(
  key: K,
  value: ChapterTitleBlock[K],
) => {
  emit('update:block', { ...props.block, [key]: value });
};
</script>

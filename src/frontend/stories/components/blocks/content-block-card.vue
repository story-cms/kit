<template>
  <BlockCardShell
    :title="blockTitle"
    :kind-icon="LayoutList"
    :expanded="expanded"
    :has-error="hasError && !readOnly"
    :presenter-visible="block.visibility.presenter && !block.visibility.hidden"
    :personal-visible="block.visibility.personal && !block.visibility.hidden"
    :navigation-visible="block.visibility.inNavigation && !block.visibility.hidden"
    kind-label="content"
    :read-only="readOnly"
    :translation-mode="translationMode"
    :block-index="blockIndex"
    @toggle="emit('toggle')"
    @delete="emit('delete')"
    @dragstart="emit('dragstart')"
    @drop="emit('drop')"
    @dragend="emit('dragend')"
  >
    <div data-block-field-row="block-name">
      <div data-block-field-content>
        <label :for="`${block.id}-block-name`" class="input-label">Block Name</label>
        <input
          :id="`${block.id}-block-name`"
          type="text"
          :value="block.blockName"
          placeholder="e.g., Summary, Introduction, Overview"
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
    </div>

    <div data-block-field-row="display-name">
      <div data-block-field-content>
        <label :for="`${block.id}-display-name`" class="input-label">Display Name</label>
        <input
          :id="`${block.id}-display-name`"
          type="text"
          :value="block.displayName"
          placeholder="e.g., Session Summary"
          class="input-field mt-[2px]"
          :class="{
            'border-error': fieldHasError('displayName'),
            'text-gray-600 shadow-none': isFieldReadOnly('displayName'),
          }"
          :readonly="isFieldReadOnly('displayName')"
          @input="updateField('displayName', ($event.target as HTMLInputElement).value)"
        />
        <p v-if="fieldHasError('displayName') && !readOnly" class="text-sm text-error">
          {{ fieldMessages('displayName')[0] }}
        </p>
      </div>
    </div>

    <div data-block-field-row="block-role">
      <div data-block-field-content>
        <RichListbox
          :model-value="block.blockRole"
          label="Block Role"
          :options="blockRoleOptions"
          :is-read-only="isFieldReadOnly('blockRole')"
          @update:model-value="updateField('blockRole', $event)"
        />
        <p v-if="fieldHasError('blockRole') && !readOnly" class="text-sm text-error">
          {{ fieldMessages('blockRole')[0] }}
        </p>
      </div>
    </div>

    <div data-block-field-row="block-style">
      <div data-block-field-content>
        <RichListbox
          :model-value="block.style"
          label="Block Style"
          :options="blockStyleOptions"
          :is-read-only="isFieldReadOnly('style')"
          @update:model-value="updateField('style', $event)"
        />
        <p v-if="fieldHasError('style') && !readOnly" class="text-sm text-error">
          {{ fieldMessages('style')[0] }}
        </p>
      </div>
    </div>

    <div>
      <div data-block-field-row="content-items-heading">
        <div data-block-field-content>
          <label class="input-label block">Content Items</label>
          <p v-if="!readOnly" class="text-sm text-gray-500">
            Add items that serve this block's role.
          </p>
          <p v-if="blockLevelErrors.length && !readOnly" class="mt-2 text-sm text-error">
            {{ blockLevelErrors[0] }}
          </p>
        </div>
      </div>

      <div class="mt-4">
        <div data-block-field-row="content-text">
          <div class="pb-6" data-block-field-content>
            <div class="mb-3 flex items-center gap-2">
              <FileText class="size-4 text-gray-500" aria-hidden="true" />
              <span class="input-label mb-0">Text</span>
            </div>
            <BlockRichTextEditor
              v-model="contentModel"
              placeholder="Enter your content..."
              :read-only="isFieldReadOnly('content')"
            />
          </div>
        </div>

        <template v-for="(item, itemIndex) in block.items" :key="item.id">
          <div
            v-if="item.kind === 'image'"
            :data-block-field-row="`content-item-${itemIndex}`"
          >
            <div class="border-t border-gray-100 pt-6" data-block-field-content>
              <div class="mb-2 flex items-center justify-between gap-3">
                <span class="input-label mb-0">Image</span>
                <button
                  v-if="!readOnly && !translationMode"
                  type="button"
                  class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove image item"
                  @click="removeItem(item.id)"
                >
                  <Trash2 class="size-4" aria-hidden="true" />
                </button>
              </div>
              <div class="[&>div]:mt-0">
                <BlockImageField
                  :model-value="item.imageUrl ?? ''"
                  :collection-id="imageCollectionId ?? ''"
                  :block-index="blockIndex"
                  :item-index="itemIndex"
                  label=""
                  :read-only="readOnly || translationMode"
                  @update:model-value="updateItem(item.id, { imageUrl: $event })"
                />
              </div>
            </div>
          </div>

          <div
            v-else-if="item.kind === 'video'"
            :data-block-field-row="`content-item-${itemIndex}`"
          >
            <div class="border-t border-gray-100 pt-6" data-block-field-content>
              <div class="mb-2 flex items-center justify-between gap-3">
                <span class="input-label mb-0">Video</span>
                <button
                  v-if="!readOnly && !translationMode"
                  type="button"
                  class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove video item"
                  @click="removeItem(item.id)"
                >
                  <Trash2 class="size-4" aria-hidden="true" />
                </button>
              </div>
              <div class="[&>div]:mt-0">
                <BlockVideoField
                  :model-value="item.video ?? { url: null }"
                  :collection-id="videoCollectionId ?? ''"
                  :block-index="blockIndex"
                  :item-index="itemIndex"
                  label=""
                  :read-only="readOnly || translationMode"
                  @update:model-value="updateItem(item.id, { video: $event })"
                />
              </div>
            </div>
          </div>

          <div
            v-else-if="item.kind === 'scripture'"
            :data-block-field-row="`content-item-${itemIndex}`"
          >
            <div class="border-t border-gray-100 pt-6" data-block-field-content>
              <div class="mb-2 flex items-center justify-between gap-3">
                <span class="input-label mb-0">Scripture</span>
                <button
                  v-if="!readOnly && !translationMode"
                  type="button"
                  class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove scripture item"
                  @click="removeItem(item.id)"
                >
                  <Trash2 class="size-4" aria-hidden="true" />
                </button>
              </div>
              <BlockScriptureField
                :model-value="item.scripture ?? { reference: '', verse: '' }"
                :block-index="blockIndex"
                :item-index="itemIndex"
                reference-label="Bible Reference"
                passage-label="Scripture Text"
                reference-placeholder="e.g., John 3:16, Romans 8:28–30"
                passage-placeholder="Paste or type the scripture passage here..."
                :read-only="readOnly"
                :reference-read-only="readOnly || translationMode"
                @update:model-value="updateItem(item.id, { scripture: $event })"
              />
            </div>
          </div>
        </template>
      </div>

      <ContentAddItemsToolbar
        v-if="!readOnly && !translationMode"
        :show-add-leaders-notes="!block.showLeadersNotes"
        @add-image="addItem('image')"
        @add-video="addItem('video')"
        @add-scripture="addItem('scripture')"
        @add-leaders-notes="updateField('showLeadersNotes', true)"
      />
    </div>

    <div v-if="block.showLeadersNotes" data-block-field-row="leaders-notes">
      <div
        class="rounded-xl border border-studio-yellow/60 bg-studio-yellow/30 p-4"
        data-block-field-content
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
            v-if="!readOnly && !translationMode"
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
          :class="{ 'text-gray-600 shadow-none': isFieldReadOnly('leadersNotes') }"
          :readonly="isFieldReadOnly('leadersNotes')"
          @input="
            updateField('leadersNotes', ($event.target as HTMLTextAreaElement).value)
          "
        />
      </div>
    </div>

    <template v-if="!readOnly && !translationMode" #footer>
      <BlockVisibility v-model="visibilityModel" />
    </template>
    <template v-else #footer>
      <BlockVisibility v-model="visibilityModel" :read-only="true" />
    </template>
  </BlockCardShell>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Crown, FileText, LayoutList, Trash2 } from '@lucide/vue';

import type { ChapterContentBlock, ChapterContentItem } from '../../../../types';
import RichListbox from '../../../shared/rich-listbox.vue';
import BlockCardShell from './block-card-shell.vue';
import BlockImageField from './block-image-field.vue';
import BlockRichTextEditor from './block-rich-text-editor.vue';
import BlockScriptureField from './block-scripture-field.vue';
import BlockVideoField from './block-video-field.vue';
import BlockVisibility from './block-visibility.vue';
import ContentAddItemsToolbar from './content-add-items-toolbar.vue';
import { createContentItem } from './block-utils';
import { getBlockRoleOptions } from './block-role-options';
import { blockStyleOptions } from './block-style-options';
import { useBlockFieldErrors } from './use-block-field-errors';

const props = withDefaults(
  defineProps<{
    block: ChapterContentBlock;
    blockIndex: number;
    expanded: boolean;
    videoCollectionId?: string;
    imageCollectionId?: string;
    chapterType?: string | null;
    template?: string | null;
    readOnly?: boolean;
    translationMode?: boolean;
  }>(),
  {
    readOnly: false,
    translationMode: false,
  },
);

const emit = defineEmits<{
  'update:block': [block: ChapterContentBlock];
  delete: [];
  toggle: [];
  dragstart: [];
  drop: [];
  dragend: [];
}>();

const { hasError, blockLevelErrors, fieldMessages, fieldHasError } = useBlockFieldErrors(
  props.blockIndex,
);

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

type EditableField =
  'blockName' | 'displayName' | 'blockRole' | 'style' | 'content' | 'leadersNotes';

const isFieldReadOnly = (field: EditableField) => {
  if (props.readOnly) return true;
  if (!props.translationMode) return false;
  return field === 'blockRole' || field === 'style';
};

const updateField = <K extends keyof ChapterContentBlock>(
  key: K,
  value: ChapterContentBlock[K],
) => {
  if (props.readOnly) return;
  if (
    props.translationMode &&
    (key === 'blockRole' || key === 'style' || key === 'visibility')
  ) {
    return;
  }
  emit('update:block', { ...props.block, [key]: value });
};

const addItem = (kind: ChapterContentItem['kind']) => {
  if (props.readOnly || props.translationMode) return;
  updateField('items', [...props.block.items, createContentItem(kind)]);
};

const removeItem = (id: string) => {
  if (props.readOnly || props.translationMode) return;
  updateField(
    'items',
    props.block.items.filter((item) => item.id !== id),
  );
};

const updateItem = (id: string, patch: Partial<ChapterContentItem>) => {
  if (props.readOnly) return;
  if (props.translationMode && ('imageUrl' in patch || 'video' in patch)) return;
  if (props.translationMode && patch.scripture && 'reference' in patch.scripture) return;
  updateField(
    'items',
    props.block.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
  );
};

const blockRoleOptions = computed(() =>
  getBlockRoleOptions(props.chapterType, props.template),
);
</script>

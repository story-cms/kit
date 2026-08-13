<template>
  <ScriptureField
    v-if="!useCustomLabels"
    :field="fieldSpec"
    :root-path="rootPath"
    :is-nested="true"
  />
  <div v-else class="space-y-4">
    <div>
      <label :for="referenceInputId" class="input-label">{{ referenceLabel }}</label>
      <input
        :id="referenceInputId"
        v-model="reference"
        type="text"
        :placeholder="referencePlaceholder"
        class="input-field mt-[2px]"
        @input="emitScripture"
        @blur="lookup"
      />
    </div>
    <div>
      <label :for="passageInputId" class="input-label">{{ passageLabel }}</label>
      <textarea
        :id="passageInputId"
        v-model="verse"
        rows="6"
        :placeholder="passagePlaceholder"
        class="input-field mt-[2px] min-h-[120px] resize-y"
        @input="emitScripture"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

import type { FieldSpec, Scripture } from '../../../../types';
import ScriptureField from '../../../fields/scripture-field.vue';
import { parseReference } from '../../../shared/helpers';
import { useModelStore, useSharedStore, useWidgetsStore } from '../../../store';

const props = withDefaults(
  defineProps<{
    modelValue: Scripture;
    blockId: string;
    itemId?: string;
    label?: string;
    referenceLabel?: string;
    passageLabel?: string;
    referencePlaceholder?: string;
    passagePlaceholder?: string;
  }>(),
  {
    itemId: undefined,
    label: 'Scripture',
    referenceLabel: undefined,
    passageLabel: undefined,
    referencePlaceholder: 'John 1 or John 1:3-4',
    passagePlaceholder: 'Verse',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: Scripture];
}>();

const model = useModelStore();
const shared = useSharedStore();
const provider = useWidgetsStore().providers.scripture;
const rootPath = computed(() => `_chapterBlocks.${props.blockId}`);
const fieldName = computed(() =>
  props.itemId ? `items.${props.itemId}.scripture` : 'scripture',
);
const scripturePath = computed(() => `${rootPath.value}.${fieldName.value}`);
const useCustomLabels = computed(() =>
  Boolean(props.referenceLabel && props.passageLabel),
);
const referenceInputId = computed(() => `${props.blockId}-${fieldName.value}-reference`);
const passageInputId = computed(() => `${props.blockId}-${fieldName.value}-passage`);

const fieldSpec = computed((): FieldSpec => ({
  label: props.label,
  name: fieldName.value,
  widget: 'scripture',
}));

const readScripture = (): Scripture =>
  model.getField(scripturePath.value, { reference: '', verse: '' }) as Scripture;

const reference = ref(props.modelValue.reference);
const verse = ref(props.modelValue.verse);

const syncPropsToModel = (value: Scripture) => {
  const current = readScripture();
  if (current.reference === value.reference && current.verse === value.verse) {
    return;
  }
  if (
    current.reference === value.reference &&
    current.verse.trim() &&
    !value.verse.trim()
  ) {
    return;
  }
  model.setField(scripturePath.value, value);
};

const emitScripture = () => {
  const next = { reference: reference.value, verse: verse.value };
  syncPropsToModel(next);
  emit('update:modelValue', next);
};

const lookup = async () => {
  if (!useCustomLabels.value || !provider?.bibleApiKey || !reference.value.trim()) {
    return;
  }
  if (verse.value.trim()) return;

  const code = parseReference(reference.value);
  if (code === '') return;

  const query = ['content-type=text', 'include-titles=false'].join('&');
  const response = await fetch(
    `https://api.scripture.api.bible/v1/bibles/${shared.bibleVersion}/passages/${code}?${query}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'api-key': provider.bibleApiKey,
      },
    },
  );

  if (response.status !== 200) return;

  const data = await response.json();
  verse.value = data.data.content
    .trim()
    .replace(/\[(\d+)\]/g, '\n`$1`')
    .replace(/¶\s/g, '')
    .replace(/^\n/, '')
    .replace(/\n\s+\n/g, '\n\n')
    .replace(/\n+/g, '\n');
  emitScripture();
};

watch(
  () => props.blockId,
  () => {
    model.setField(scripturePath.value, { ...props.modelValue });
  },
  { immediate: true },
);

watch(
  () => props.modelValue,
  (value) => {
    reference.value = value.reference;
    verse.value = value.verse;
    syncPropsToModel(value);
  },
  { deep: true },
);

const unsubscribe = model.$subscribe(() => {
  const fresh = readScripture();
  if (
    fresh.reference === props.modelValue.reference &&
    fresh.verse === props.modelValue.verse
  ) {
    return;
  }
  reference.value = fresh.reference;
  verse.value = fresh.verse;
  emit('update:modelValue', { ...fresh });
});

onBeforeUnmount(() => {
  unsubscribe();
});
</script>

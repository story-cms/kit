<template>
  <div
    :class="{
      'rounded border border-gray-100 bg-white p-8 drop-shadow-sm': !isNested,
      'mt-4': isNested,
    }"
  >
    <label
      for="first-name"
      class="block text-sm font-medium text-gray-700"
      :class="{ 'text-gray-600': props.isReadOnly }"
      >{{ field.label }}</label
    >
    <div
      class="mt-1"
      :class="{ '[&_.CodeMirror-lines]:text-gray-600': props.isReadOnly }"
    >
      <div
        :class="{
          'rounded border border-error': hasError,
        }"
      >
        <textarea
          ref="textArea"
          data-testid="markdown-field"
          :readonly="props.isReadOnly"
        />
      </div>
      <p v-if="hasError" class="mt-[8px] text-sm text-error">
        {{ errors[0] }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onMounted } from 'vue';
import type { FieldSpec } from '../../interfaces';
import { useModelStore, useSharedStore } from '../store';
import { commonProps } from '../shared/helpers';
import type { Editor, EditorChange } from 'codemirror';
import { customToolbarButtons, defaultButtons } from './Markdown/toolbar-buttons';
// import EasyMDE from 'easymde';

const props = defineProps({
  ...commonProps,
});

const model = useModelStore();
const shared = useSharedStore();

const field = computed(() => props.field as FieldSpec);
const fieldPath = computed(() => {
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

const update = (e: Editor, change: EditorChange) => {
  if (change.origin === 'setValue') return;
  model.setField(fieldPath.value, e.getValue());
};

const load = () => {
  nextTick().then(() => {
    if (props.isReadOnly) {
      if (mde?.value()) return;

      const value = model.getSourceField(fieldPath.value, '');
      mde?.codemirror.setValue(value);
      return;
    }

    const fresh = model.getField(fieldPath.value, '') as unknown as string;
    if (fresh === mde?.value()) return;

    mde?.codemirror.setValue(fresh);
  });
};

model.$subscribe(load);

const errors = computed(() => shared.errorMessages(fieldPath.value));
const hasError = computed(() => errors.value.length > 0 && !props.isReadOnly);

shared.$subscribe(() => {
  if (props.isReadOnly) {
    mde?.codemirror.setOption('theme', 'en');
    return;
  }

  mde?.codemirror.setOption('direction', shared.languageDirection);
  mde?.codemirror.setOption('rtlMoveVisually', shared.isRtl);
  mde?.codemirror.setOption('theme', shared.locale);
});

let mde: EasyMDE | null = null;
const textArea = ref(undefined);

const toolbar = computed((): (string | { name: string })[] => {
  if (field.value.minimal) return [];

  if (props.isReadOnly)
    return [customToolbarButtons.find((obj) => obj.name === 'transparent') || { name: 'transparent' }];
  // NOTE: make sure to clone the field before passing it to MDE where it is mutated
  if (field.value.toolbar)
    return Array.from(
      field.value.toolbar.map((item) => {
        const obj = customToolbarButtons.find((obj) => obj.name === item);
        return obj ? obj : item;
      }),
    );

  return defaultButtons;
});

onMounted(async () => {
  // to be able to export the component without browser references,
  // we have to dynamically import the easymde dependency
  const easymdeModule = await import('easymde');
  const EasyMDE = easymdeModule.default;
  mde = new EasyMDE({
    minHeight: field.value.minimal ? 'auto' : '300px',
    element: textArea.value,
    spellChecker: false,
    nativeSpellcheck: false,
    status: false,
    toolbar: toolbar.value,
  });
  mde?.codemirror.setOption('readOnly', props.isReadOnly);
  mde?.codemirror.on('change', update);
  load();
});
</script>

<style>
@import 'easymde/dist/easymde.min.css';

.editor-toolbar {
  background-color: white !important;
}
</style>

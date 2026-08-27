<template>
  <div>
    <label v-if="label" class="input-label mb-2 block">{{ label }}</label>
    <div class="mt-1">
      <div class="cm-s-easymde rounded-xl">
        <textarea ref="textArea" data-testid="block-rich-text-editor" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { Editor, EditorChange } from 'codemirror';
import type EasyMDE from '../../../fields/markdown/types';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    placeholder?: string;
    readOnly?: boolean;
  }>(),
  {
    label: '',
    placeholder: 'Enter your content...',
    readOnly: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const textArea = ref<HTMLTextAreaElement>();
let mde: EasyMDE | null = null;
let isSettingValue = false;

const toolbar = [
  'bold',
  'italic',
  'strikethrough',
  'unordered-list',
  'ordered-list',
  '|',
  'link',
];

const onEditorChange = (_editor: Editor, change: EditorChange) => {
  if (props.readOnly || change.origin === 'setValue' || isSettingValue) return;
  emit('update:modelValue', mde?.value() ?? '');
};

const syncValue = (value: string) => {
  if (!mde || mde.value() === value) return;
  isSettingValue = true;
  mde.codemirror.setValue(value);
  isSettingValue = false;
};

watch(
  () => props.modelValue,
  (value) => {
    syncValue(value);
  },
);

onMounted(async () => {
  const easymdeModule = await import('easymde');
  const EasyMDEConstructor = easymdeModule.default;
  mde = new EasyMDEConstructor({
    minHeight: '200px',
    element: textArea.value,
    spellChecker: false,
    nativeSpellcheck: false,
    status: false,
    placeholder: props.placeholder,
    // @ts-expect-error toolbar is not typed
    toolbar,
  });
  mde.codemirror.on('change', onEditorChange);
  mde.codemirror.setOption('readOnly', props.readOnly);
  syncValue(props.modelValue);
});

watch(
  () => props.readOnly,
  (value) => {
    mde?.codemirror.setOption('readOnly', value);
  },
);

onBeforeUnmount(() => {
  mde?.toTextArea();
  mde?.codemirror.off('change', onEditorChange);
  mde = null;
});
</script>

<style>
@import 'easymde/dist/easymde.min.css';

.editor-toolbar {
  background-color: white !important;
}
</style>

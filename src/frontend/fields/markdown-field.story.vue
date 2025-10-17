<template>
  <Story title="Markdown Field" group="widgets">
    <Variant title="With model" :setup-app="loadData">
      <MarkdownField :field="spec" />
      <ModelControl :model="objectModel" />
    </Variant>

    <Variant title="With custom toolbar buttons" :setup-app="loadData">
      <MarkdownField
        :field="{
          ...spec,
          toolbar: ['bold', 'italic', 'heading', 'footnote'],
        }"
      />
      <ModelControl :model="objectModel" />
    </Variant>

    <Variant title="Error" :setup-app="loadData">
      <MarkdownField :field="spec" />
      <ErrorControl :errors="objectErrors" />
    </Variant>

    <Variant title="Minimal" :setup-app="loadData">
      <MarkdownField :field="{ ...spec, minimal: true }" />
    </Variant>

    <Variant title="Toolbar buttons" :setup-app="loadData">
      <MarkdownField
        :field="{
          ...spec,
          toolbar: [
            'bold',
            'italic',
            'heading',
            'quote',
            'unordered-list',
            'ordered-list',
            'link',
            'superscript',
            'scripture-reference',
          ],
        }"
      />
    </Variant>

    <Variant title="Without Toolbar buttons" :setup-app="loadData">
      <MarkdownField
        :field="{
          ...spec,
          minimal: true,
          toolbar: [],
        }"
      />
    </Variant>

    <Variant title="RTL" :setup-app="loadData">
      <MarkdownField :dir="isRtl ? 'rtl' : 'ltr'" :field="spec" />
      <LanguageControl />
    </Variant>

    <Variant title="Readonly" :setup-app="loadData">
      <MarkdownField
        :field="{
          name: 'notes',
          label: 'Notes',
          widget: 'markdown',
          toolbar: ['bold'],
        }"
        :is-read-only="true"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MarkdownField from './markdown-field.vue';
import LanguageControl from '../test/language-control.vue';
import ErrorControl from '../test/error-control.vue';
import ModelControl from '../test/model-control.vue';
import { objectErrors, objectModel } from '../../frontend/test/mocks';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const isRtl = computed(() => {
  return useSharedStore().isRtl;
});

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  if (variant?.title === 'Error') {
    shared.errors = objectErrors;
  }
  if (variant?.title === 'Readonly') {
    store.setSource({
      ...objectModel,
      notes: '# This is a readonly note',
    });
  }
  store.model = objectModel;
};

const spec = {
  name: 'notes',
  label: 'Notes',
  widget: 'markdown',
  isReadOnly: false,
};
</script>

<docs lang="md">
# Markdown Field

WYSIWIG markdown editor powered by the amazing CodeMirror engine.

- [CodeMirror - Engine](https://codemirror.net/)
- [EasyMDE - Wrapper](https://github.com/Ionaru/easy-markdown-editor)

## Toolbar customization

You can customize the toolbar by passing a `toolbar` option in the config:

```js
{

  ...

  toolbar: [
      "bold",
      "italic",
      "heading",
      "|",
      "quote",
      "unordered-list",
      "ordered-list",
      "|",
      "link",
      {
        name: "footnote",
        action: (editor) => {
          const selection = editor.codemirror.getSelection();
          const newValue = `[${selection}](^${selection})`;
          return editor.codemirror.replaceSelection(newValue);
        },
        className: "fa fa-asterisk",
        title: "Footnote Button",
      },
      "|",
      "preview",
      "side-by-side",
      "fullscreen",
      "guide",
    ],

  ...

}
```

See the docs: https://github.com/Ionaru/easy-markdown-editor#toolbar-customization
</docs>

<template>
  <Story title="Note Field" group="widgets">
    <Variant title="With model" :setup-app="loadData">
      <NoteFile :field="fieldSpec" />
      <ModelControl :model="noteModel" />
    </Variant>

    <Variant title="Minimal editor (reflection)" :setup-app="loadData">
      <NoteFile :field="fieldSpec" />
      <ModelControl :model="noteModelReflection" />
    </Variant>

    <Variant title="Nested rootPath" :setup-app="loadData">
      <NoteFile :field="fieldSpec" root-path="studyNote" />
      <ModelControl :model="noteModelNested" />
    </Variant>

    <Variant title="Readonly" :setup-app="loadData">
      <NoteFile :field="fieldSpec" :is-read-only="true" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import NoteFile from './note-file.vue';
import ModelControl from '../test/model-control.vue';
import { useModelStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const fieldSpec = {
  name: 'note',
  label: 'Note',
  widget: 'markdown',
};

const noteModel = {
  type: 'comment' as const,
  content: '# Study note\nExplain the **key idea** in your own words.',
};

const noteModelReflection = {
  type: 'reflection' as const,
  content: 'What would change if you applied this tomorrow?',
};

const noteModelNested = {
  studyNote: {
    type: 'keyPoint' as const,
    content: 'Main takeaway: *focus* beats volume.',
  },
};

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();

  if (variant?.title === 'Minimal editor (reflection)') {
    store.model = { ...noteModelReflection };
    return;
  }

  if (variant?.title === 'Nested rootPath') {
    store.model = { ...noteModelNested };
    return;
  }

  if (variant?.title === 'Readonly') {
    store.setSource({
      type: 'definition',
      content: '# Source term\n**Epiphany** — a sudden insight.',
    });
    store.model = {
      type: 'comment',
      content: 'Draft content (hidden when reading source).',
    };
    return;
  }

  store.model = { ...noteModel };
};
</script>

<docs lang="md">
# Note field

Combined **note type** select (Q&A, reflection, key point, cue, definition) and **markdown** content. Reflection, key point, and cue use a minimal markdown surface; other types use the richer toolbar.
</docs>

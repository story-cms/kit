<template>
  <Story title="Scripture Reference Field" group="widgets">
    <Variant title="With data" :setup-app="loadData">
      <ScriptureReferenceField :field="scriptureReferenceSpec" />
      <ModelControl :model="scriptureReferenceModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Empty">
      <ScriptureReferenceField :field="scriptureReferenceSpec" />
      <ModelControl :model="scriptureReferenceModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Read Only" :setup-app="loadData">
      <ScriptureReferenceField :field="scriptureReferenceSpec" :is-read-only="true" />
    </Variant>

    <Variant title="Single Reference" :setup-app="loadData">
      <ScriptureReferenceField :field="{ ...scriptureReferenceSpec, allowMany: false }" />
    </Variant>

    <Variant title="Error" :setup-app="loadData">
      <ScriptureReferenceField :field="scriptureReferenceSpec" />
      <template #controls>
        <ErrorControl :errors="scriptureReferenceError" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ScriptureReferenceField from './scripture-reference-field.vue';
import ErrorControl from '../test/error-control.vue';
import ModelControl from '../test/model-control.vue';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const scriptureReferenceSpec = {
  name: 'passage',
  widget: 'scriptureReference',
  label: "Today's Passage",
};

const scriptureReferenceModel = {
  passage: ['JHN.12.10-JHN.12.14', 'MAT.3.16'],
};

const scriptureReferenceError = {
  'bundle.passage': ['required validation failed'],
};

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  if (variant?.title === 'Error') {
    shared.errors = scriptureReferenceError;
  }

  if (variant?.title === 'Single Reference') {
    store.model = {
      passage: ['MAT.3.16'],
    };
    return;
  }

  if (variant?.title === 'Read Only') {
    store.setSource({
      passage: ['JHN.12.10-JHN.12.14', 'MAT.3.16'],
    });
  }

  store.model = scriptureReferenceModel;
};
</script>

<docs lang="md">
# Scripture Reference Field

A scripture reference picker that renders a ScriptureReferenceField. It has one optional
special property:

- `allowMany` accepts a boolean value; defaults to `true`

The widget automatically parses user input (like "John 12:10-14") into the API format ("JHN.12.10-JHN.12.14") and stores both the human-readable label and the parsed reference.

example:

```typescript
{
    label: "Further reading",
    name: "passage",
    widget: "scriptureReference",
    allowMany: false
}
```
</docs>

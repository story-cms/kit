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

    <Variant title="ReadOnly" :setup-app="loadData">
      <ScriptureReferenceField :field="scriptureReferenceSpec" :is-read-only="true" />
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
  label: "Today's Passage",
  widget: 'scriptureReference',
};

const scriptureReferenceModel = {
  passage: {
    label: 'John 12:10-14',
    reference: 'JHN.12.10-JHN.12.14',
  },
};

const scriptureReferenceError = {
  'bundle.passage.reference': ['required validation failed'],
  'bundle.passage.label': ['that does not look quite right'],
};

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  if (variant?.title === 'Error') {
    shared.errors = scriptureReferenceError;
  }
  if (variant?.title === 'ReadOnly') {
    store.setSource({
      passage: {
        label: 'Matthew 3:16',
        reference: 'MAT.3.16',
      },
    });
    return;
  }
  store.model = scriptureReferenceModel;
};
</script>

<docs lang="md">
# Scripture Reference Field

A simplified scripture field that only handles reference input and parsing. Similar to the ScriptureField but without the verse textarea.

## Features

- **Reference Input**: Users can type scripture references like "John 1" or "John 1:3-4"
- **Auto-Parsing**: On blur, the input is parsed and displayed as a readonly label
- **Editable Label**: Users can modify the parsed label without losing the reference
- **Re-parse**: Clicking the "×" button clears the parsed label to force re-parsing
- **Error Handling**: Shows validation errors if parsing fails

## Usage

```javascript
{
  label: 'Today\'s Passage',
  name: 'passage',
  widget: 'scriptureReference',
}
```

## Data Structure

The field stores data in this format:

```typescript
{
  label: 'John 12:10-14',        // Human-readable label
  reference: 'JHN.12.10-JHN.12.14'  // Parsed reference for API calls
}
```
</docs>

<template>
  <Story title="Spread Field" group="widgets">
    <Variant title="Scripture spread" :setup-app="loadData">
      <SpreadField :field="fieldSpec" root-path="spread" />
      <ModelControl :model="scriptureSpreadModel" />
    </Variant>

    <Variant title="Non-scripture spread" :setup-app="loadData">
      <SpreadField :field="fieldSpec" root-path="spread" />
      <ModelControl :model="specialSpreadModel" />
    </Variant>

    <Variant title="Nested rootPath" :setup-app="loadData">
      <SpreadField :field="fieldSpec" root-path="chapter.spread" />
      <ModelControl :model="nestedSpreadModel" />
    </Variant>

    <Variant title="Error on notes" :setup-app="loadData">
      <SpreadField :field="fieldSpec" root-path="spread" />
      <ErrorControl :errors="spreadNotesErrors" />
    </Variant>

    <Variant title="Readonly" :setup-app="loadData">
      <SpreadField :field="fieldSpec" root-path="spread" :is-read-only="true" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import SpreadField from './spread-field.vue';
import ModelControl from '../test/model-control.vue';
import ErrorControl from '../test/error-control.vue';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const fieldSpec = {
  name: 'spread',
  label: 'Spread',
  widget: 'panel',
};

const scriptureSpreadModel = {
  passage: { reference: 'John 3:16' },
  spread: {
    type: 'scripture' as const,
    scripture: {
      reference: 'John 3:16',
      verse:
        '`16` For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    },
    title: 'John 3:16',
    subtitle: "God's love for the world",
    callout: 'Read slowly',
    notes: '',
    isInsert: false,
  },
};

const specialSpreadModel = {
  spread: {
    type: 'stopAndThink' as const,
    title: 'Pause for a moment',
    subtitle: 'What would you do differently this week?',
    notes: '',
  },
};

const nestedSpreadModel = {
  passage: { reference: 'Psalm 23:1' },
  chapter: {
    spread: {
      type: 'scripture' as const,
      scripture: {
        reference: 'Psalm 23:1',
        verse: '`1` The Lord is my shepherd; I shall not want.',
      },
      title: 'Psalm 23:1',
      subtitle: 'The good shepherd',
      callout: '',
      notes: '',
      isInsert: false,
    },
  },
};

const spreadNotesErrors = {
  'bundle.spread.notes': ['Notes failed validation'],
};

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  if (variant?.title === 'Non-scripture spread') {
    store.model = { ...specialSpreadModel };
    return;
  }

  if (variant?.title === 'Nested rootPath') {
    store.model = { ...nestedSpreadModel };
    return;
  }

  if (variant?.title === 'Error on notes') {
    shared.errors = spreadNotesErrors;
    store.model = { ...scriptureSpreadModel };
    return;
  }

  if (variant?.title === 'Readonly') {
    store.setSource({
      spread: {
        type: 'scripture',
        scripture: {
          reference: 'Romans 8:28',
          verse:
            '`28` And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
        },
        title: 'Romans 8:28',
        subtitle: 'Source column',
        callout: 'From translation',
        notes: '',
        isInsert: false,
      },
    });
    store.model = {
      passage: { reference: 'John 1:1' },
      spread: {
        type: 'scripture',
        scripture: {
          reference: 'John 1:1',
          verse: 'Draft verse text',
        },
        title: 'John 1:1',
        subtitle: 'Draft subtitle',
        callout: '',
        notes: '',
        isInsert: false,
      },
    };
    return;
  }

  store.model = { ...scriptureSpreadModel };
};
</script>

<docs lang="md">
# Spread field

**Spread type** select switches between a **scripture** spread (scripture widget, callout, title driven from the passage reference) and a **non-scripture** (“stop and think”) spread (title + subtitle). Optional **notes** at `{rootPath}.notes` surface validation via the shared error map under `bundle.{rootPath}.notes`.
</docs>

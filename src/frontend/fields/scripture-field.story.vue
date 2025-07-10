<template>
  <Story title="Scripture Field" group="widgets">
    <Variant title="With data" :setup-app="loadData">
      <ScriptureField :field="scriptureSpec" />
      <ModelControl :model="scriptureModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Empty">
      <ScriptureField :field="scriptureSpec" />
      <ModelControl :model="scriptureModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="German" :setup-app="setGerman">
      <ScriptureField :field="scriptureSpec" />
      <ModelControl :model="scriptureModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Prepopulated German" :setup-app="setPrepopulatedGerman">
      <ScriptureField :field="scriptureSpec" />
      <ModelControl :model="scriptureModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="ReadOnly" :setup-app="loadData">
      <ScriptureField :field="scriptureSpec" :is-read-only="true" />
    </Variant>

    <Variant title="Error" :setup-app="loadData">
      <ScriptureField :field="scriptureSpec" />
      <template #controls>
        <ErrorControl :errors="scriptureError" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ScriptureField from './scripture-field.vue';
import ErrorControl from '../test/error-control.vue';
import ModelControl from '../test/model-control.vue';
import { scriptureSpec, scriptureModel } from '../test/mocks';

import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const scriptureError = {
  'bundle.scripture.verse': ['required validation failed'],
  'bundle.scripture.reference': ['that does not look quite right'],
};

const kjv = 'de4e12af7f28f599-02';

const setGerman: StoryHandler = () => {
  const shared = useSharedStore();
  shared.setLanguage({
    locale: 'de',
    language: 'Deutsch',
    languageDirection: 'ltr',
    bibleVersion: kjv,
  });
};

const setPrepopulatedGerman: StoryHandler = () => {
  const store = useModelStore();
  const shared = useSharedStore();
  shared.setLanguage({
    locale: 'de',
    language: 'Deutsch',
    languageDirection: 'ltr',
    bibleVersion: kjv,
  });

  store.setSource({
    scripture: {
      reference: 'Matthew 3:16',
      verse:
        '`16` And when Jesus was baptized, immediately he went up from the water, and behold, the heavens were opened to him, and he saw the Spirit of God descending like a dove and coming to rest on him',
    },
  });
};

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  if (variant?.title === 'Error') {
    shared.errors = scriptureError;
  }
  if (variant?.title === 'ReadOnly') {
    store.setSource({
      scripture: {
        reference: 'Matthew 3:16',
        verse:
          '`16` And when Jesus was baptized, immediately he went up from the water, and behold, the heavens were opened to him, and he saw the Spirit of God descending like a dove and coming to rest on him',
      },
    });
    return;
  }
  store.model = scriptureModel;
};
</script>

<docs lang="md">
# Scripture Field
</docs>

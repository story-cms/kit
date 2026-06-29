<template>
  <Story title="Tag Field" group="widgets">
    <Variant title="Default">
      <TagField :field="spec" />
      <ModelControl :model="objectModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="With model" :setup-app="loadData">
      <TagField :field="spec" />
      <ModelControl :model="objectModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Error" :setup-app="loadData">
      <TagField :field="spec" />
      <template #controls>
        <ErrorControl :errors="objectErrors" />
      </template>
    </Variant>

    <Variant title="RTL" :setup-app="loadData">
      <TagField :dir="isRtl ? 'rtl' : 'ltr'" :field="spec" />
      <LanguageControl />
    </Variant>

    <Variant title="Readonly" :setup-app="loadData">
      <TagField :field="spec" :is-read-only="true" />
    </Variant>

    <Variant title="Readonly empty" :setup-app="loadReadonlyEmpty">
      <div class="grid grid-cols-2 gap-x-4">
        <TagField :field="spec" />
        <TagField :field="spec" :is-read-only="true" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TagField from './tag-field.vue';
import LanguageControl from '../test/language-control.vue';
import ErrorControl from '../test/error-control.vue';
import ModelControl from '../test/model-control.vue';
import { objectErrors, objectModel } from '../test/mocks';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const isRtl = computed(() => {
  return useSharedStore().isRtl;
});

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  store.model = {
    name: 'John Kiptum',
    tags: 'althetics, athlete, olympic, marathon',
  };
  if (variant?.title === 'Error') {
    shared.errors = objectErrors;
  }
  if (variant?.title === 'Readonly') {
    store.setSource({
      tags: 'simul,justus,et,peccator,In principio erat Verbum, et Verbum erat apud Deum, et Deus erat Verbum.',
    });
  }
};

const loadReadonlyEmpty: StoryHandler = (): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  store.model = { tags: '' };
  store.setSource({ tags: '' });
  shared.clearErrors();
};

const spec = {
  name: 'tags',
  label: 'Tags',
  widget: 'tags',
};
</script>

<docs lang="md">
# Tag Field

Comma-separated tag pills with add/remove. In translation mode, read-only columns use the
source model; empty read-only fields keep the same container height as the editable column.

## Variants

- **Readonly empty** — side-by-side editable and read-only with no tags (translation layout)
</docs>

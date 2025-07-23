<template>
  <Story title="Tag Field" group="widgets">
    <Variant title="Default">
      <TagField :field="{ name: 'tags', label: 'Tags', widget: 'tag' }" />
      <ModelControl :model="tagsModel" />
    </Variant>
    <Variant title="With model" :setup-app="loadData">
      <TagField :field="{ name: 'tags', label: 'Tags', widget: 'tag' }" />
      <ModelControl :model="tagsModel" />
    </Variant>
    <Variant title="With error" :setup-app="loadData">
      <TagField :field="{ name: 'tags', label: 'Tags', widget: 'tag' }" />
      <ModelControl :model="tagsModel" />
    </Variant>
    <Variant title="Read only" :setup-app="loadData">
      <TagField
        :field="{ name: 'tags', label: 'Tags', widget: 'tag' }"
        :is-read-only="true"
      />
      <ModelControl :model="tagsModel" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import TagField from './tag-field.vue';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';
import ModelControl from '../test/model-control.vue';

const tagsModel = {
  tags: ['simul', 'justus', 'et', 'peccator'],
};

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  if (variant?.title === 'Read Only') {
    store.setSource(tagsModel);
    return;
  }

  if (variant?.title === 'With error') {
    shared.errors = {
      'bundle.tags': ['required validation failed'],
    };
    return;
  }
  store.model = tagsModel;
};
</script>

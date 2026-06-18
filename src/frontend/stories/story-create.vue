<template>
  <AppLayout>
    <template #header>
      <ContentHeader :title="title || 'New Story'">
        <template #actions>
          <PillButton label="Create" variant="green" @click="createStory" />
        </template>
      </ContentHeader>
    </template>

    <section>
      <div class="relative grid mx-auto max-w-4xl grid-cols-1">
        <form class="space-y-8">
          <StoryEditDetails :is-translation="false" :templates="props.templates" />
        </form>
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';

import type { SharedPageProps, StoryCreateProps } from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore, useWidgetsStore, useModelStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import PillButton from '../shared/pill-button.vue';
import StoryEditDetails from './components/story-edit-details.vue';

const props = defineProps<StoryCreateProps & SharedPageProps>();

const shared = useSharedStore();
shared.setFromProps(props);
shared.clearErrors();
useWidgetsStore().setProviders(props.providers);

const model = useModelStore();
model.setModel(props.model);

const title = ref(props.model.title);

model.$subscribe(() => {
  title.value = model.getField('title', 'New Story');
});

const getPayload = () => {
  return {
    title: model.getField('title', ''),
    coverImage: model.getField('coverImage', ''),
    description: model.getField('description', ''),
    chapterLimit: model.getField('chapterLimit', 0),
    tags: model.getField('tags', ''),
    storyType: model.getField('storyType', ''),
    chapterType: model.getField('chapterType', ''),
    sectionType: model.getField('sectionType', ''),
    visibility: model.getField('visibility', ''),
    template: model.getField('template', ''),
  };
};

const createStory = () => {
  shared.clearErrors();

  router.post(`/${shared.locale}/story`, getPayload(), {
    preserveScroll: true,

    onSuccess: () => {
      shared.addMessage(ResponseStatus.Confirmation, 'Story created successfully');
    },

    onError: (errors) => {
      shared.setErrors(errors);
      shared.addMessage(ResponseStatus.Failure, 'Error creating story');
    },
  });
};
</script>

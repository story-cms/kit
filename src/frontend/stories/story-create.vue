<template>
  <AppLayout title="Add Story" :subtitle="headerSubtitle">
    <template #actions>
          <StudioButton
            label="Create Story"
            variant="secondary"
            :disabled="isSaving"
            @click="createStory"
          />
        </template>

    <div class="relative mt-3">
      <form :dir="shared.isRtl ? 'rtl' : 'ltr'" class="form-panel">
        <StoryEditDetails :is-translation="false" :templates="props.templates" />
      </form>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { router } from '@inertiajs/vue3';

import type { SharedPageProps, StoryCreateProps } from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore, useWidgetsStore, useModelStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import StudioButton from '../shared/studio-button.vue';
import StoryEditDetails from './components/story-edit-details.vue';

const props = defineProps<StoryCreateProps & SharedPageProps>();

const shared = useSharedStore();
shared.setFromProps(props);
if (Object.keys(props.errors ?? {}).length === 0) {
  shared.clearErrors();
}
useWidgetsStore().setProviders(props.providers);

const model = useModelStore();
model.setModel(props.model);

const title = ref(props.model.title);
const isSaving = ref(false);

model.$subscribe(() => {
  title.value = model.getField('title', 'New Story');
});

const headerSubtitle = computed(() => title.value?.trim() || 'Create Story');

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
  isSaving.value = true;

  router.post(`/${shared.locale}/story`, getPayload(), {
    preserveScroll: true,

    onSuccess: () => {
      shared.addMessage(ResponseStatus.Confirmation, 'Story created successfully');
    },

    onError: (errors) => {
      shared.setErrors(errors);
      shared.addMessage(ResponseStatus.Failure, 'Error creating story');
    },

    onFinish: () => {
      isSaving.value = false;
    },
  });
};
</script>

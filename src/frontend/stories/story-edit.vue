<template>
  <AppLayout>
    <template #header>
      <ContentHeader :title="title || 'New Story'">
        <template #actions>
          <ActionButton icon="info" @tap="shared.setShowMetaBox(!shared.showMetaBox)" />
          <ActionButton v-if="isNew" icon="trash" @tap="deleteStory" />
          <LabelButton label="Save" @tap="saveStory" />
        </template>
      </ContentHeader>
    </template>

    <section>
      <div
        :class="[
          'relative grid',
          {
            'grid-cols-[1fr_375px] gap-x-4': !shared.isSingleColumn,
            'mx-auto max-w-4xl grid-cols-1': shared.isSingleColumn,
          },
        ]"
      >
        <form class="space-y-8 bg-white py-4">
          <StringField
            :field="{
              name: 'name',
              label: 'Title',
              widget: 'string',
            }"
            :is-nested="true"
            class="px-8"
          />
          <ImageField
            :field="{
              label: 'Cover Image',
              name: 'coverImage',
              widget: 'image',
              description: 'JPG file up to 300K',
              extensions: ['.jpeg', '.jpg'],
              maxSize: 300000,
            }"
            :is-nested="true"
            class="px-8"
          />
          <NumberField
            :field="{
              name: 'chapterLimit',
              label: 'Chapters',
              widget: 'number',
            }"
            :is-nested="true"
            class="px-8"
          />
          <TagField
            :field="{
              name: 'tags',
              label: 'Tags',
              widget: 'tags',
            }"
            :is-nested="true"
            class="px-8"
          />
          <MarkdownField
            :field="{
              name: 'description',
              label: 'Description',
              widget: 'markdown',
              toolbar: [],
            }"
            :is-nested="true"
            class="px-8"
          />
        </form>

        <ContentSidebar>
          <template #meta-box>
            <MetaMetaBox
              :story-type="story.storyType"
              :chapter-type="story.chapterType"
              :name="props.story.name"
              :created-at="story.createdAt as unknown as string"
              :updated-at="savedAt"
            />
          </template>
        </ContentSidebar>
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { SharedPageProps } from '@story-cms/kit';
import {
  AppLayout,
  ContentHeader,
  useSharedStore,
  MarkdownField,
  StringField,
  ImageField,
  NumberField,
  ContentSidebar,
  useModelStore,
  useWidgetsStore,
  router,
  TagField,
} from '@story-cms/kit/ui';
import { ResponseStatus, StoryEditProps } from '../../types';
import LabelButton from '../shared/label-button.vue';
import { onMounted, ref } from 'vue';
import { DateTime } from 'luxon';
import MetaMetaBox from './components/meta-meta-box.vue';
import ActionButton from '../shared/action-button.vue';

const props = defineProps<StoryEditProps & SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);
shared.clearErrors();
useWidgetsStore().setProviders(props.providers);

const model = useModelStore();
model.setModel(props.story);

const title = ref(props.story.name);
const savedAt = ref(props.story.updatedAt as unknown as string);

onMounted(() => {
  model.$subscribe(() => {
    title.value = model.getField('name', 'New Story');
  });
});

const deleteStory = () => {
  router.delete(`/${shared.locale}/story/${props.story.id}`, {
    onSuccess: () => shared.addMessage(ResponseStatus.Confirmation, 'Story deleted'),
    onError: () => shared.addMessage(ResponseStatus.Failure, 'Error deleting story'),
  });
};

const getPayload = () => {
  return {
    name: model.getField('name', ''),
    coverImage: model.getField('coverImage', ''),
    chapterLimit: model.getField('chapterLimit', 0),
    tags: model.getField('tags', ''),
    description: model.getField('description', ''),
  };
};

const saveStory = () => {
  shared.clearErrors();

  router.post(`/${shared.locale}/story/${props.story.id}`, getPayload(), {
    preserveScroll: true,

    onSuccess: () => {
      savedAt.value = DateTime.now().toISO() ?? '';
      shared.addMessage(ResponseStatus.Confirmation, 'Story saved successfully');
    },

    onError: (errors) => {
      shared.setErrors(errors);
      shared.addMessage(ResponseStatus.Failure, 'Error saving story');
    },
  });
};
</script>

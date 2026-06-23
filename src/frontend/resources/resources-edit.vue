<template>
  <AppLayout>
    <template #header>
      <ContentHeader dir="ltr" :title="title">
        <template #actions>
          <div class="flex items-center gap-3">
            <PillButton label="Cancel" variant="gray" @click="cancel" />
            <PillButton
              v-if="!resource.id"
              label="Create Resource"
              variant="blue"
              :disabled="isSaving"
              @click="save"
            />
            <PillButton
              v-else
              label="Save Changes"
              variant="blue"
              :disabled="isSaving"
              @click="save"
            />
          </div>
        </template>
      </ContentHeader>
    </template>

    <div class="relative mx-auto max-w-4xl">
      <form :dir="shared.isRtl ? 'rtl' : 'ltr'" class="space-y-8 bg-white py-4">
        <StringField
          :field="{
            name: 'title',
            label: 'Title',
            widget: 'string',
            placeholderText: 'Enter resource title',
          }"
          :is-nested="true"
          class="px-8"
        />

        <div class="px-8">
          <label class="mb-2 block text-sm font-medium text-gray-700"
            >Resource Type</label
          >
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="typeOption in resourceTypes"
              :key="typeOption.value"
              type="button"
              class="flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-colors"
              :class="
                selectedType === typeOption.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              "
              @click="setType(typeOption.value)"
            >
              <component :is="typeOption.icon" class="size-4" aria-hidden="true" />
              {{ typeOption.label }}
            </button>
          </div>
        </div>

        <ImageField
          :field="{
            label: 'Thumbnail Image (Optional)',
            name: 'imageUrl',
            widget: 'image',
            uploadPreset: 'resources',
            description: 'JPG or PNG up to 5MB',
            extensions: ['.jpg', '.jpeg', '.png', '.webp'],
            maxSize: 5000000,
          }"
          :is-nested="true"
          class="px-8"
        />

        <VideoField
          v-if="selectedType === 'video'"
          :field="{
            label: 'Video',
            name: 'video',
            widget: 'video',
            description: 'MP4 and MOV files up to 500MB',
            extensions: ['.mp4', '.mov'],
            collectionId: config.videoCollectionId,
            maxSize: 500662310,
          }"
          :is-nested="true"
          class="px-8"
        />

        <StringField
          v-if="selectedType === 'info_link'"
          :field="{
            name: 'infoUrl',
            label: 'URL',
            widget: 'string',
            placeholderText: 'https://...',
          }"
          :is-nested="true"
          class="px-8"
        />

        <MarkdownField
          v-if="selectedType === 'text'"
          :field="{
            name: 'content',
            label: 'Content',
            widget: 'markdown',
            toolbar: [
              'heading',
              'bold',
              'italic',
              'ordered-list',
              'unordered-list',
              'quote',
              'link',
              '|',
              'undo',
              'redo',
            ],
          }"
          :is-nested="true"
          class="px-8"
        />

        <MarkdownField
          :field="{
            name: 'description',
            label: 'Description',
            widget: 'markdown',
            noMarkup: true,
            placeholderText: 'Brief description of this resource...',
          }"
          :is-nested="true"
          class="px-8"
        />

        <div class="grid grid-cols-1 gap-6 px-8 md:grid-cols-2">
          <StringField
            :field="{
              name: 'label',
              label: 'Label',
              widget: 'string',
              placeholderText: 'e.g., Supplementary Reading',
            }"
            :is-nested="true"
          />

          <SelectField
            :field="{
              label: 'Visibility',
              name: 'visibility',
              widget: 'select',
              options: [
                { label: 'Public', value: 'public' },
                { label: 'Guests', value: 'guests' },
                { label: 'Leaders', value: 'leaders' },
              ],
              default: 'public',
            }"
            :is-free="true"
            :is-nested="true"
          />
        </div>
      </form>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue';
import { router } from '@inertiajs/vue3';
import { ExternalLink, FileText, Video } from '@lucide/vue';
import type { Component } from 'vue';
import {
  type ResourceEditProps,
  type ResourceType,
  type ResourcePayload,
  ResponseStatus,
  type SharedPageProps,
} from '../../types';
import { useModelStore, useSharedStore, useWidgetsStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';

import PillButton from '../shared/pill-button.vue';
import StringField from '../fields/string-field.vue';
import ImageField from '../fields/image-field.vue';
import SelectField from '../fields/select-field.vue';
import MarkdownField from '../fields/markdown-field.vue';
import VideoField from '../fields/video-field.vue';

const props = defineProps<ResourceEditProps & SharedPageProps>();

const { bundle, resource } = toRefs(props);
const model = useModelStore();
const shared = useSharedStore();

model.setModel(bundle.value);
shared.setFromProps(props);
if (Object.keys(props.errors ?? {}).length === 0) {
  shared.clearErrors();
}
useWidgetsStore().setProviders(props.providers);

const selectedType = ref<ResourceType>(
  model.getField('type', 'info_link') as ResourceType,
);
const title = ref(
  resource.value.id
    ? (model.getField('title', 'Edit Resource') as string)
    : 'Create New Resource',
);
const isSaving = ref(false);

const resourceTypes: { value: ResourceType; label: string; icon: Component }[] = [
  { value: 'info_link', label: 'Info Link', icon: ExternalLink },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'text', label: 'Text', icon: FileText },
];

const setType = (type: ResourceType) => {
  selectedType.value = type;
  model.setField('type', type);

  if (type === 'video' && !model.isPopulated('video')) {
    model.setField('video', { url: null });
  }
  if (type === 'text' && !model.isPopulated('content')) {
    model.setField('content', '');
  }
  if (type === 'info_link' && !model.isPopulated('infoUrl')) {
    model.setField('infoUrl', '');
  }
};

const getPayload = (): ResourcePayload => model.model as ResourcePayload;

const cancel = () => {
  router.visit(`/${shared.locale}/resource`);
};

const save = () => {
  shared.clearErrors();
  isSaving.value = true;

  const onFinish = () => {
    isSaving.value = false;
  };

  const onError = (errors: Record<string, string>) => {
    shared.setErrors(errors);
    shared.addMessage(
      ResponseStatus.Failure,
      resource.value.id ? 'Error saving resource' : 'Error creating resource',
    );
  };

  if (!resource.value.id) {
    router.post(`/${shared.locale}/resource`, getPayload(), {
      onSuccess: () => {
        shared.addMessage(ResponseStatus.Confirmation, 'Resource created successfully');
      },
      onError,
      onFinish,
    });
    return;
  }

  router.post(`/${shared.locale}/resource/${resource.value.id}`, getPayload(), {
    preserveScroll: true,
    onError,
    onFinish,
  });
};

onMounted(() => {
  model.$subscribe(() => {
    selectedType.value = model.getField('type', 'info_link') as ResourceType;

    const modelTitle = model.getField('title', '') as string;
    title.value =
      modelTitle || (resource.value.id ? 'Edit Resource' : 'Create New Resource');
  });
});
</script>

<template>
  <AppLayout>
    <template #header>
      <ContentHeader dir="ltr" :title="title">
        <template #actions>
          <div class="flex items-center gap-3">
            <DraftActions v-if="!isNew" @delete="deleteResource" />

            <button
              type="button"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              @click="save"
            >
              {{ isNew ? 'Create Resource' : 'Save Changes' }}
            </button>
          </div>
        </template>
      </ContentHeader>
    </template>

    <div
      :class="[
        'relative grid',
        {
          'grid-cols-[1fr_375px] gap-x-4': !shared.isSingleColumn && !isNew,
          'mx-auto max-w-4xl grid-cols-1': shared.isSingleColumn || isNew,
        },
      ]"
    >
      <form
        :dir="shared.isRtl ? 'rtl' : 'ltr'"
        class="space-y-8 bg-white py-4"
        @submit.prevent="save"
      >
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

      <ContentSidebar v-if="!isNew">
        <template #meta-box>
          <ResourceMetaBox
            :id="resource.id"
            :created-at="resource.createdAt"
            :saved-at="savedAt"
            :updated-at="resource.updatedAt"
            :published-at="publishedAt"
          />
        </template>
      </ContentSidebar>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watch } from 'vue';
import { DateTime } from 'luxon';
import { router } from '@inertiajs/vue3';
import { ExternalLink, FileText, Video } from '@lucide/vue';
import type { Component } from 'vue';
import {
  type ResourceEditProps,
  type ResourceType,
  type VisibilityType,
  ResponseStatus,
  type SharedPageProps,
} from '../../types';
import { useModelStore, useSharedStore, useWidgetsStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import DraftActions from '../shared/draft-actions.vue';
import StringField from '../fields/string-field.vue';
import ImageField from '../fields/image-field.vue';
import SelectField from '../fields/select-field.vue';
import MarkdownField from '../fields/markdown-field.vue';
import BooleanField from '../fields/boolean-field.vue';
import VideoField from '../fields/video-field.vue';
import ContentSidebar from '../shared/content-sidebar.vue';
import ResourceMetaBox from './resource-meta-box.vue';

const props = defineProps<ResourceEditProps & SharedPageProps>();

type RequestPayload = {
  title: string;
  type: ResourceType;
  imageUrl: string;
  description: string;
  label: string;
  visibility: VisibilityType;
  isPublished: boolean;
  content?: string;
  infoUrl?: string;
  video?: { url: string | null };
};

let isRevertingPublished = false;

const { bundle, resource, isNew } = toRefs(props);
const model = useModelStore();
const shared = useSharedStore();

model.setModel(bundle.value);
shared.setFromProps(props);
shared.clearErrors();
useWidgetsStore().setProviders(props.providers);

const selectedType = ref<ResourceType>(
  model.getField('type', 'info_link') as ResourceType,
);
const title = ref(
  isNew.value
    ? 'Create New Resource'
    : (model.getField('title', 'Edit Resource') as string),
);
const isPublished = ref(Boolean(model.getField('isPublished', false)));
const savedAt = ref(resource.value.updatedAt);

const resourceTypes: { value: ResourceType; label: string; icon: Component }[] = [
  { value: 'info_link', label: 'Info Link', icon: ExternalLink },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'text', label: 'Text', icon: FileText },
];

const publishedAt = computed(() =>
  isPublished.value ? (resource.value.updatedAt as string) : 'unpublished',
);

const setType = (type: ResourceType) => {
  selectedType.value = type;
  model.setField('type', type);
};

const getPayload = (): RequestPayload => ({ ...model.model }) as RequestPayload;

const save = () => {
  shared.clearErrors();

  if (isNew.value) {
    router.post(`/${shared.locale}/resource`, getPayload(), {
      onError: (errors) => {
        shared.setErrors(errors);
        shared.addMessage(ResponseStatus.Failure, 'Error creating resource');
      },
    });
    return;
  }

  router.post(`/${shared.locale}/resource/${resource.value.id}`, getPayload(), {
    preserveScroll: true,
    onSuccess: () => {
      savedAt.value = DateTime.now().toISO() ?? '';
      shared.addMessage(ResponseStatus.Accomplishment, 'Resource saved');
    },
    onError: (errors) => {
      shared.setErrors(errors);
      isRevertingPublished = true;
      isPublished.value = false;
      model.setField('isPublished', false);
      shared.addMessage(ResponseStatus.Failure, 'Error saving resource');
    },
  });
};

const cancel = () => {
  router.visit(`/${shared.locale}/resource`);
};

const deleteResource = () => {
  router.delete(`/${shared.locale}/resource/${resource.value.id}`, {
    onSuccess: () => shared.addMessage(ResponseStatus.Confirmation, 'Resource deleted'),
    onError: () => shared.addMessage(ResponseStatus.Failure, 'Error deleting resource'),
  });
};

watch(
  () => shared.errors,
  (newErrors) => {
    if (newErrors && Object.keys(newErrors).length > 0) {
      isRevertingPublished = true;
      isPublished.value = false;
      model.setField('isPublished', false);
    }
  },
  { deep: true },
);

onMounted(() => {
  model.$subscribe(() => {
    if (isRevertingPublished) {
      isRevertingPublished = false;
      return;
    }

    selectedType.value = model.getField('type', 'info_link') as ResourceType;

    if (isNew.value) {
      title.value = 'Create New Resource';
    } else {
      title.value =
        (model.getField('title', 'Edit Resource') as string) || 'Edit Resource';
    }

    isPublished.value = Boolean(model.getField('isPublished', false));
  });
});
</script>

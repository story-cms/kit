<template>
  <AppLayout>
    <template #header>
      <ContentHeader :title="headerTitle">
        <template #description>
          <div class="text-xs font-medium uppercase tracking-wide text-gray-500">
            {{ isNew ? 'New Resource' : 'Edit Resource' }}
          </div>
        </template>
        <template #actions>
          <div class="flex items-center gap-3">
            <DraftActions v-if="!isNew" @delete="deleteResource" />
            <BooleanField
              :field="{
                name: 'isPublished',
                label: 'Published',
                widget: 'boolean',
                default: false,
                tintColor: 'green-400',
                labelOrder: 'start',
              }"
              :is-nested="true"
            />
            <button
              type="button"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              @click="cancel"
            >
              Cancel
            </button>
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
        'relative mx-auto max-w-5xl px-3',
        {
          'grid grid-cols-[1fr_375px] gap-x-4': !shared.isSingleColumn && !isNew,
          'grid-cols-1': shared.isSingleColumn || isNew,
        },
      ]"
    >
      <form
        :dir="shared.isRtl ? 'rtl' : 'ltr'"
        class="space-y-6 rounded-xl border border-gray-200 bg-white p-8"
        @submit.prevent="save"
      >
        <StringField
          :field="{
            name: 'title',
            label: 'Title',
            widget: 'string',
          }"
          :is-nested="true"
        />

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">Resource Type</label>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="typeOption in resourceTypes"
              :key="typeOption.value"
              type="button"
              class="flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 capitalize transition-colors"
              :class="
                selectedType === typeOption.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              "
              @click="setType(typeOption.value)"
            >
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
        />

        <VideoField
          v-if="selectedType === 'video'"
          :field="{
            label: 'Video',
            name: 'video',
            widget: 'video',
          }"
          :is-nested="true"
        />

        <StringField
          v-if="selectedType === 'info_link'"
          :field="{
            name: 'infoUrl',
            label: 'URL',
            widget: 'string',
          }"
          :is-nested="true"
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
        />

        <StringField
          :field="{
            name: 'description',
            label: 'Description',
            widget: 'string',
          }"
          :is-nested="true"
        />

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <StringField
            :field="{
              name: 'label',
              label: 'Label',
              widget: 'string',
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
          <div class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">
            <p><span class="font-medium text-gray-900">Created:</span> {{ resource.createdAt }}</p>
            <p class="mt-2">
              <span class="font-medium text-gray-900">Updated:</span> {{ resource.updatedAt }}
            </p>
          </div>
        </template>
      </ContentSidebar>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from 'vue';
import { router } from '@inertiajs/vue3';
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
import StringField from '../fields/string-field.vue';
import ImageField from '../fields/image-field.vue';
import SelectField from '../fields/select-field.vue';
import MarkdownField from '../fields/markdown-field.vue';
import BooleanField from '../fields/boolean-field.vue';
import VideoField from '../fields/video-field.vue';
import DraftActions from '../shared/draft-actions.vue';
import ContentSidebar from '../shared/content-sidebar.vue';

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

const { bundle, resource, isNew } = toRefs(props);
const model = useModelStore();
const shared = useSharedStore();

model.setModel(bundle.value);
shared.setFromProps(props);
shared.clearErrors();
useWidgetsStore().setProviders(props.providers);

const selectedType = ref<ResourceType>(model.getField('type', 'info_link') as ResourceType);
const title = ref(model.getField('title', '') as string);

const resourceTypes = [
  { value: 'info_link' as ResourceType, label: 'Info Link' },
  { value: 'video' as ResourceType, label: 'Video' },
  { value: 'text' as ResourceType, label: 'Text' },
];

const headerTitle = computed(() => {
  if (isNew.value) return 'Create New Resource';
  return title.value || 'Edit Resource';
});

const setType = (type: ResourceType) => {
  selectedType.value = type;
  model.setField('type', type);
};

const getPayload = (): RequestPayload => ({ ...model.model } as RequestPayload);

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
      shared.addMessage(ResponseStatus.Accomplishment, 'Resource saved');
    },
    onError: (errors) => {
      shared.setErrors(errors);
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

onMounted(() => {
  model.$subscribe(() => {
    selectedType.value = model.getField('type', 'info_link') as ResourceType;
    title.value = model.getField('title', '') as string;
  });
});
</script>

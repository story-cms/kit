<template>
  <AppLayout>
    <template #header>
      <GlassHeader :title="headerTitle" :subtitle="headerSubtitle">
        <template #actions>
          <StudioButton label="Cancel" variant="outline" @click="cancel" />
          <StudioButton
            v-if="!resource.id"
            label="Create Resource"
            :disabled="isSaving"
            variant="primary"
            @click="save"
          />
          <StudioButton
            v-else
            label="Save Changes"
            :disabled="isSaving"
            variant="blue"
            @click="save"
          />
        </template>
      </GlassHeader>
    </template>

    <div class="relative mt-3">
      <form :dir="shared.isRtl ? 'rtl' : 'ltr'" class="form-panel">
        <StringField
          :field="{
            name: 'title',
            label: 'Title',
            widget: 'string',
            placeholderText: 'Enter resource title',
          }"
          :is-nested="true"
        />

        <MarkdownField
          :field="{
            name: 'description',
            label: 'Description',
            widget: 'markdown',
            noMarkup: true,
            minimal: true,
            placeholderText: 'Brief description of this resource...',
          }"
          :is-nested="true"
        />

        <div>
          <RichListbox
            v-model="selectedType"
            label="Resource Type"
            :options="resourceTypes"
            @update:model-value="setType"
          />
        </div>

        <StringField
          v-if="selectedType === 'url_link'"
          :field="{
            name: 'url',
            label: 'URL',
            widget: 'string',
            placeholderText: 'https://...',
          }"
          :is-nested="true"
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
        />

        <MarkdownField
          v-if="selectedType === 'text'"
          :field="{
            name: 'content',
            label: 'Article Content',
            widget: 'markdown',
            placeholderText: 'Write your article content here...',
            toolbar: [
              'heading-1',
              'heading-2',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'unordered-list',
              'ordered-list',
              'quote',
              'horizontal-rule',
              'link',
              '|',
              'undo',
              'redo',
            ],
          }"
          :is-nested="true"
        />

        <ImageField
          :field="{
            label: 'Cover Image (Optional)',
            name: 'imageUrl',
            widget: 'image',
            uploadPreset: 'resources',
            description: 'PNG, JPG, GIF up to 10MB',
            extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
            maxSize: 10_000_000,
          }"
          :is-nested="true"
        />

        <StringField
          :field="{
            name: 'label',
            label: 'Label',
            widget: 'string',
            placeholderText: 'e.g., Supplementary Reading',
          }"
          :is-nested="true"
        />

        <RichListbox
          v-model="visibility"
          label="Visibility"
          :options="visibilityOptions"
          @update:model-value="setVisibility"
        />
      </form>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from 'vue';
import { router } from '@inertiajs/vue3';
import { Crown, ExternalLink, FileText, Globe, User, Video } from '@lucide/vue';
import type { Component } from 'vue';
import {
  type ResourceEditProps,
  type ResourceType,
  type ResourcePayload,
  ResponseStatus,
  type SharedPageProps,
  type VisibilityType,
} from '../../types';
import { useModelStore, useSharedStore, useWidgetsStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import GlassHeader from '../shared/glass-header.vue';
import StudioButton from '../shared/studio-button.vue';
import RichListbox from '../shared/rich-listbox.vue';
import StringField from '../fields/string-field.vue';
import ImageField from '../fields/image-field.vue';
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
  model.getField('type', 'url_link') as ResourceType,
);
const visibility = ref<VisibilityType>(
  model.getField('visibility', 'public') as VisibilityType,
);
const isSaving = ref(false);

const headerTitle = computed(() =>
  resource.value.id ? 'Edit Resource' : 'Add Resource',
);
const headerSubtitle = computed(() => {
  const title = ((model.model as ResourcePayload).title ?? '').trim();
  if (!resource.value.id) return title || 'Create Resource';
  return title || 'Edit Resource';
});

const resourceTypes: {
  value: ResourceType;
  label: string;
  description: string;
  icon: Component;
}[] = [
  {
    value: 'url_link',
    label: 'URL Link',
    description: 'Link to an external website or resource',
    icon: ExternalLink,
  },
  {
    value: 'video',
    label: 'Video',
    description: 'Upload a video file',
    icon: Video,
  },
  {
    value: 'text',
    label: 'Article',
    description: 'Write a rich-text article',
    icon: FileText,
  },
];

const visibilityOptions: {
  value: VisibilityType;
  label: string;
  description: string;
  icon: Component;
}[] = [
  {
    value: 'public',
    label: 'Public',
    description: 'Visible to all users',
    icon: Globe,
  },
  {
    value: 'guests',
    label: 'Guest',
    description: 'Visible to logged-in guests',
    icon: User,
  },
  {
    value: 'leaders',
    label: 'Leader',
    description: 'Restricted to group leaders only',
    icon: Crown,
  },
];

const setType = (type: string) => {
  const resourceType = type as ResourceType;
  selectedType.value = resourceType;
  model.setField('type', resourceType);

  if (resourceType !== 'url_link') {
    model.setField('url', '');
  } else if (!model.isPopulated('url')) {
    model.setField('url', '');
  }

  if (resourceType !== 'video') {
    model.setField('video', { url: null });
  } else if (!model.isPopulated('video')) {
    model.setField('video', { url: null });
  }

  if (resourceType !== 'text') {
    model.setField('content', '');
  } else if (!model.isPopulated('content')) {
    model.setField('content', '');
  }
};

const setVisibility = (value: string) => {
  const visibilityValue = value as VisibilityType;
  visibility.value = visibilityValue;
  model.setField('visibility', visibilityValue);
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
    selectedType.value = model.getField('type', 'url_link') as ResourceType;
    visibility.value = model.getField('visibility', 'public') as VisibilityType;
  });
});
</script>

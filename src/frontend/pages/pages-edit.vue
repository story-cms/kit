<template>
  <AppLayout>
    <template #header>
      <ContentHeader dir="ltr" :title="title">
        <template #actions>
          <DraftActions @delete="deletePage" />
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
        </template>
      </ContentHeader>
    </template>

    <div
      :class="[
        'relative grid',
        {
          'grid-cols-[1fr_375px] gap-x-4': !shared.isSingleColumn,
          'mx-auto max-w-4xl grid-cols-1': shared.isSingleColumn,
        },
      ]"
    >
      <form :dir="shared.isRtl ? 'rtl' : 'ltr'" class="space-y-8 bg-white py-4">
        <StringField
          :field="{
            name: 'title',
            label: 'Title',
            widget: 'string',
          }"
          :is-nested="true"
          class="px-8"
        />
        <ImageField
          :field="{
            label: 'Menu Icon',
            name: 'icon',
            widget: 'image',
            uploadPreset: 'menuicon',
            description: 'Square svg to 5MB',
            extensions: ['.svg'],
            maxSize: 5662310,
          }"
          :is-nested="true"
          class="px-8"
        />
        <StringField
          :field="{
            name: 'description',
            label: 'Short Description',
            widget: 'string',
          }"
          :is-nested="true"
          class="px-8"
        />
        <StringField
          :field="{
            name: 'category',
            label: 'Category',
            widget: 'string',
          }"
          :is-nested="true"
          class="px-8"
        />
        <SelectField
          :field="{
            label: 'Page Type',
            name: 'type',
            widget: 'select',
            options: [
              { label: 'Text', value: 'text' },
              { label: 'Link', value: 'link' },
            ],
            default: defaultType,
          }"
          :is-free="true"
          :is-nested="true"
          class="px-8"
        />
        <StringField
          v-if="isLink"
          :field="{
            name: 'body',
            label: 'External Link',
            widget: 'string',
          }"
          :is-nested="true"
          class="px-8"
        />
        <MarkdownField
          v-else
          :field="{
            name: 'body',
            label: 'Body',
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
      </form>
      <ContentSidebar>
        <template #meta-box>
          <PageMetaBox
            :created-at="page.createdAt"
            :saved-at="savedAt"
            :updated-at="page.updatedAt"
            :published-at="publishedAt"
          />
        </template>
      </ContentSidebar>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, toRefs, watch, onUnmounted } from 'vue';
import { DateTime } from 'luxon';
import { router } from '@inertiajs/vue3';
import { type SharedPageProps, type PageEditProps, ResponseStatus } from '../../types';
import { useModelStore, useSharedStore, useWidgetsStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import { debounce } from '../shared/helpers';
import StringField from '../fields/string-field.vue';
import ImageField from '../fields/image-field.vue';
import SelectField from '../fields/select-field.vue';
import MarkdownField from '../fields/markdown-field.vue';
import BooleanField from '../fields/boolean-field.vue';
import PageMetaBox from './page-meta-box.vue';
import DraftActions from '../shared/draft-actions.vue';
import ContentSidebar from '../shared/content-sidebar.vue';
const props = defineProps<PageEditProps & SharedPageProps>();

type RequestPayload = {
  title: string;
  description: string;
  icon: string;
  type: string;
  body: string;
  isPublished: boolean;
};

let isRevertingPublished = false;

const { bundle, page } = toRefs(props);
const model = useModelStore();
const shared = useSharedStore();

model.setModel(bundle.value);
shared.setFromProps(props);
shared.clearErrors();
useWidgetsStore().setProviders(props.providers);

const getPayload = (): RequestPayload => {
  const payload = {
    ...model.model,
  } as unknown;

  return payload as RequestPayload;
};

const defaultType = ref(model.getField('body', '').startsWith('http') ? 'link' : 'text');

const selection = ref(model.getField('type', defaultType));
const title = ref(model.getField('title', 'Page'));
const isPublished = ref(Boolean(model.getField('isPublished', false)));

const savedAt = ref(page.value['updatedAt']);
const publishedAt = computed(() =>
  isPublished.value ? (page.value['updatedAt'] as string) : 'unpublished',
);

const isLink = computed((): boolean => selection.value === 'link');

const save = debounce(1000, () => {
  shared.clearErrors();

  router.post(`/${shared.locale}/page/${props.page.id}`, getPayload(), {
    preserveScroll: true,

    onSuccess: () => {
      savedAt.value = DateTime.now().toISO() ?? '';
    },

    onError: (errors) => {
      shared.setErrors(errors);
      // Set isPublished to false when errors occur
      isPublished.value = false;
      model.setField('isPublished', false);
      shared.addMessage(ResponseStatus.Failure, 'Error saving page');
    },
  });
});

const deletePage = () => {
  router.delete(`/${shared.locale}/page/${props.page.id}`, {
    onSuccess: () => shared.addMessage(ResponseStatus.Confirmation, 'Page deleted'),
    onError: () => shared.addMessage(ResponseStatus.Failure, 'Error deleting page'),
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

    save();
    selection.value = model.getField('type', defaultType);
    title.value = model.getField('title', 'Page');
    isPublished.value = Boolean(model.getField('isPublished', false));
  });
  if (shared.meta.hasAppPreview) {
    shared.setShowAppPreview(false);
  }
});
onUnmounted(() => {
  if (shared.meta.hasAppPreview) {
    shared.setShowAppPreview(true);
  }
});
</script>

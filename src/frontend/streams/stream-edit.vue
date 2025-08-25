<template>
  <AppLayout>
    <template #header>
      <ContentHeader dir="ltr" :title="title">
        <template #actions>
          <DraftActions @delete="onDelete" />
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
      <form :dir="shared.isRtl ? 'rtl' : 'ltr'" class="space-y-8">
        <StringField
          :field="{
            name: 'title',
            label: 'Title',
            widget: 'string',
          }"
          :is-nested="false"
          class="px-8"
        />
        <ImageField
          :field="{
            label: 'Cover Image',
            name: 'coverImage',
            widget: 'image',
            uploadPreset: 'ml_default',
            description: 'Square jpg to 300k',
            extensions: ['.jpg', '.jpeg'],
            maxSize: 300000,
          }"
          :is-nested="false"
          class="px-8"
        />
        <DateField
          :field="{
            name: 'releaseAt',
            label: 'Release At',
            widget: 'date',
          }"
          :is-nested="false"
          class="px-8"
        />
        <div v-for="(item, index) in props.spec.fields" :key="index">
          <component :is="widgetFor(index)" :field="item" :is-nested="false" />
        </div>
      </form>
      <ContentSidebar>
        <template #meta-box>
          <DropMetaBox
            :created-at="props.meta.createdAt"
            :updated-at="updatedAt"
            :updated-by="props.meta.updatedBy"
          />
        </template>
      </ContentSidebar>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { DateTime } from 'luxon';
import { router } from '@inertiajs/vue3';
import type { StreamEditProps, FieldSpec, SharedPageProps } from '../../types';
import { ResponseStatus } from '../../types';

import { useSharedStore, useModelStore, useWidgetsStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import ContentSidebar from '../shared/content-sidebar.vue';
import BooleanField from '../fields/boolean-field.vue';
import StringField from '../fields/string-field.vue';
import ImageField from '../fields/image-field.vue';
import DateField from '../fields/date-field.vue';
import DraftActions from '../shared/draft-actions.vue';
import { debounce } from '../shared/helpers';

import DropMetaBox from './components/drop-meta-box.vue';

const props = defineProps<StreamEditProps & SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);
shared.clearErrors();

const widgets = useWidgetsStore();
widgets.setProviders(props.providers);

// form
const model = useModelStore();
model.setModel(props.model);

const widgetFor = (key: number) => {
  const widget = (props.spec.fields as FieldSpec[])[key].widget;
  return widgets.picker(widget);
};

// meta

const title = ref(model.getField('title', props.spec.dropType));
const isPublished = ref(Boolean(model.getField('isPublished', false)));
const updatedAt = ref(props.meta.updatedAt);

const onDelete = () => {
  router.delete(`/${shared.locale}/drop/${props.meta.id}`, {
    onSuccess: () =>
      shared.addMessage(ResponseStatus.Confirmation, `${props.spec.dropType} deleted`),
    onError: () =>
      shared.addMessage(ResponseStatus.Failure, `Error deleting ${props.spec.dropType}`),
  });
};

// autosave

let isRevertingPublished = false;

const save = debounce(1000, () => {
  shared.clearErrors();

  router.post(`/${shared.locale}/drop/${props.meta.id}`, getPayload(), {
    preserveScroll: true,

    onSuccess: () => {
      updatedAt.value = DateTime.now().toISO() ?? '';
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
    title.value = model.getField('title', 'Drop');
    isPublished.value = Boolean(model.getField('isPublished', false));
  });
});

const getPayload = (): any => {
  const payload = {
    ...model.model,
  } as unknown;

  return payload;
};
</script>

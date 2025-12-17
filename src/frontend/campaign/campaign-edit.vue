<template>
  <AppLayout>
    <template #header>
      <ContentHeader dir="ltr" :title="title">
        <template #actions>
          <DraftActions @delete="deleteCampaign" />
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
            name: 'name',
            label: 'Name',
            widget: 'string',
          }"
          :is-nested="true"
          class="px-8"
        />
        <RegionField
          :field="{
            name: 'regions',
            label: 'Regions',
            widget: 'region',
          }"
          :is-nested="true"
          class="px-8"
        />
        <DateRangeField
          :field="{
            name: 'window',
            label: 'Campaign window',
            widget: 'dateRange',
          }"
          :is-nested="true"
          class="px-8"
        />
        <ImageField
          :field="{
            label: 'Promo image',
            name: 'promoImage',
            widget: 'image',
            uploadPreset: 'pilot-feeds',
            description: 'JPG   file up to 300K',
            extensions: ['.jpg', '.jpeg'],
            maxSize: 300000,
          }"
          :is-nested="true"
          class="px-8"
        />
        <StringField
          :field="{
            name: 'title',
            label: 'Title',
            widget: 'string',
          }"
          :is-nested="true"
          class="px-8"
        />
        <MarkdownField
          :field="{
            name: 'message',
            label: 'Message',
            widget: 'markdown',
          }"
          :is-nested="true"
          class="px-8"
        />
        <StringField
          :field="{
            name: 'actionLabel',
            label: 'Action Label',
            widget: 'string',
          }"
          :is-nested="true"
          class="px-8"
        />
        <SelectField
          :field="{
            label: 'Action Type',
            name: 'actionType',
            widget: 'select',
            options: [
              { label: 'Close', value: 'close' },
              { label: 'Donate', value: 'donate' },
              { label: 'External URL', value: 'externalUrl' },
            ],
            default: defaultType,
          }"
          :is-free="true"
          :is-nested="true"
          class="px-8"
        />
        <StringField
          :field="{
            name: 'actionUrl',
            label: 'Action URL',
            widget: 'string',
          }"
          :is-nested="true"
          class="px-8"
        />
      </form>
      <ContentSidebar>
        <template #meta-box>
          <CampaignMetaBox
            :id="campaign.id"
            :created-at="campaign.createdAt"
            :saved-at="savedAt"
            :updated-at="campaign.updatedAt"
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
import {
  type SharedPageProps,
  type CampaignEditProps,
  ResponseStatus,
} from '../../types';
import { useModelStore, useSharedStore, useWidgetsStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import { debounce } from '../shared/helpers';
import StringField from '../fields/string-field.vue';
import ImageField from '../fields/image-field.vue';
import SelectField from '../fields/select-field.vue';
import MarkdownField from '../fields/markdown-field.vue';
import BooleanField from '../fields/boolean-field.vue';
import CampaignMetaBox from './campaign-meta-box.vue';
import DraftActions from '../shared/draft-actions.vue';
import ContentSidebar from '../shared/content-sidebar.vue';
import RegionField from '../fields/region-field.vue';
import DateRangeField from '../fields/date-range-field.vue';

const props = defineProps<CampaignEditProps & SharedPageProps>();

type RequestPayload = {
  name: string;
  regions: string;
  window: string;
  promoImage: string;
  title: string;
  message: string;
  actionLabel: string;
  actionType: string;
  actionUrl: string;
  isPublished: boolean;
};

let isRevertingPublished = false;

const { bundle, campaign } = toRefs(props);
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

const defaultType = ref(model.getField('type', 'donate'));

const selection = ref(model.getField('type', defaultType));
const title = ref(model.getField('name', 'New Campaign'));
const isPublished = ref(Boolean(model.getField('isPublished', false)));

const savedAt = ref(campaign.value['updatedAt']);
const publishedAt = computed(() =>
  isPublished.value ? (campaign.value['updatedAt'] as string) : 'unpublished',
);

const save = debounce(1000, () => {
  shared.clearErrors();

  router.post(`/${shared.locale}/campaign/${props.campaign.id}`, getPayload(), {
    preserveScroll: true,

    onSuccess: () => {
      savedAt.value = DateTime.now().toISO() ?? '';
    },

    onError: (errors) => {
      shared.setErrors(errors);
      // Set isPublished to false when errors occur
      isPublished.value = false;
      model.setField('isPublished', false);
      shared.addMessage(ResponseStatus.Failure, 'Error saving campaign');
    },
  });
});

const deleteCampaign = () => {
  router.delete(`/${shared.locale}/campaign/${props.campaign.id}`, {
    onSuccess: () => shared.addMessage(ResponseStatus.Confirmation, 'Campaign deleted'),
    onError: () => shared.addMessage(ResponseStatus.Failure, 'Error deleting campaign'),
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
    title.value = model.getField('name', 'Campaign');
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

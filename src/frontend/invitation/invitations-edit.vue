<template>
  <AppLayout title="Invitation" :subtitle="title">
    <template #actions>
      <DraftActions @delete="deleteInvitation" />
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
    <template #main>
      <div
        :class="[
          'relative grid',
          {
            'grid-cols-[1fr_375px] gap-x-4': !shared.isSingleColumn,
            'mx-auto grid-cols-1': shared.isSingleColumn,
          },
        ]"
      >
        <form :dir="shared.isRtl ? 'rtl' : 'ltr'" class="form-panel">
          <StringField
            :field="{
              name: 'name',
              label: 'Name',
              widget: 'string',
            }"
            :is-nested="true"
          />

          <RegionField
            :field="{
              name: 'regions',
              label: 'Filter Regions',
              widget: 'region',
            }"
            :is-nested="true"
          />

          <DateRangeField
            :field="{
              name: 'window',
              label: 'Invitation window',
              widget: 'dateRange',
            }"
            :is-nested="true"
          />

          <ImageField
            :field="{
              label: 'Promo Image',
              name: 'promoImage',
              widget: 'image',
              uploadPreset: 'invitations',
              description: 'JPG file up to 300KB',
              extensions: ['.jpg', '.jpeg'],
              maxSize: 300000,
            }"
            :is-nested="true"
          />

          <StringField
            :field="{
              name: 'videoUrl',
              label: 'Video URL',
              widget: 'string',
            }"
            :is-nested="true"
          />

          <StringField
            :field="{
              name: 'title',
              label: 'Title',
              widget: 'string',
            }"
            :is-nested="true"
          />

          <MarkdownField
            :field="{
              name: 'message',
              label: 'Message',
              widget: 'markdown',
              noMarkup: true,
            }"
            :is-nested="true"
          />

          <StringField
            :field="{
              name: 'actionLabel',
              label: 'Action Label',
              widget: 'string',
            }"
            :is-nested="true"
          />

          <RichListbox
            v-model="selection"
            label="Action Type"
            :options="actionTypeOptions"
            @update:model-value="setActionType"
          />

          <StringField
            v-if="!urlFieldIsDisabled"
            :field="{
              name: 'actionUrl',
              label: 'Action URL',
              widget: 'string',
            }"
            :is-nested="true"
          />
          <div v-else>
            <p class="my-16"></p>
          </div>
        </form>

        <ContentSidebar>
          <template #meta-box>
            <InvitationMetaBox
              :id="invitation.id"
              :created-at="invitation.createdAt"
              :saved-at="savedAt"
              :updated-at="invitation.updatedAt"
              :published-at="publishedAt"
              :status="status"
            />
            <div class="mt-6"></div>
            <InvitationStats :impressions="stats?.impressions" :clicks="stats?.clicks" />
          </template>
        </ContentSidebar>
      </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, toRefs, watch } from 'vue';
import type { Component } from 'vue';
import { DateTime } from 'luxon';
import { router } from '@inertiajs/vue3';
import { ExternalLink, Heart, X } from '@lucide/vue';
import axios from 'axios';
import {
  type SharedPageProps,
  type InvitationEditProps,
  ResponseStatus,
  type InvitationStats as InvitationStatsType,
} from '../../types';
import { useModelStore, useSharedStore, useWidgetsStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import RichListbox from '../shared/rich-listbox.vue';
import { debounce, getInvitationStatus } from '../shared/helpers';
import StringField from '../fields/string-field.vue';
import ImageField from '../fields/image-field.vue';
import MarkdownField from '../fields/markdown-field.vue';
import BooleanField from '../fields/boolean-field.vue';
import InvitationMetaBox from './invitation-meta-box.vue';
import InvitationStats from './invitation-stats.vue';
import DraftActions from '../shared/draft-actions.vue';
import ContentSidebar from '../shared/content-sidebar.vue';
import RegionField from '../fields/region-field.vue';
import DateRangeField from '../fields/date-range-field.vue';

const props = defineProps<InvitationEditProps & SharedPageProps>();

type RequestPayload = {
  name: string;
  regions: string;
  window: string;
  promoImage: string;
  videoUrl: string;
  title: string;
  message: string;
  actionLabel: string;
  actionType: string;
  actionUrl: string;
  isPublished: boolean;
};

let ignoreTheNextChange = false;

const { bundle, invitation } = toRefs(props);
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

const defaultType = 'donate';

const currentActionType = model.getField('actionType', '');
if (!currentActionType) {
  model.setField('actionType', defaultType);
}

const selection = ref(model.getField('actionType', defaultType));
const title = ref(model.getField('name', 'New Invitation'));
const isPublished = ref(Boolean(model.getField('isPublished', false)));

const actionTypeOptions: {
  value: string;
  label: string;
  description: string;
  icon: Component;
}[] = [
  {
    value: 'close',
    label: 'Close',
    description: 'Dismiss the invitation',
    icon: X,
  },
  {
    value: 'donate',
    label: 'Donate',
    description: 'Open the in-app donate flow',
    icon: Heart,
  },
  {
    value: 'externalUrl',
    label: 'External URL',
    description: 'Link to an external website',
    icon: ExternalLink,
  },
];

const setActionType = (type: string) => {
  const previousSelection = selection.value;
  selection.value = type;
  model.setField('actionType', type);

  if (previousSelection === 'externalUrl' && type !== 'externalUrl') {
    const actionUrl = model.getField('actionUrl', '');
    if (actionUrl) model.setField('actionUrl', '');
  }
};

const savedAt = ref(invitation.value['updatedAt']);
const publishedAt = computed(() =>
  isPublished.value ? (invitation.value['updatedAt'] as string) : 'unpublished',
);

const status = computed(() => {
  const windowValue = model.getField('window', '') as string;
  return getInvitationStatus(isPublished.value, windowValue);
});

const save = debounce(1000, () => {
  shared.clearErrors();

  router.post(`/${shared.locale}/invitation/${props.invitation.id}`, getPayload(), {
    preserveScroll: true,

    onSuccess: () => {
      savedAt.value = DateTime.now().toISO() ?? '';
    },

    onError: (errors) => {
      shared.setErrors(errors);
      // Set isPublished to false when errors occur
      isPublished.value = false;
      model.setField('isPublished', false);
      shared.addMessage(ResponseStatus.Failure, 'Error saving invitation');
    },
  });
});

const deleteInvitation = () => {
  router.delete(`/${shared.locale}/invitation/${props.invitation.id}`, {
    onSuccess: () => shared.addMessage(ResponseStatus.Confirmation, 'Invitation deleted'),
    onError: () => shared.addMessage(ResponseStatus.Failure, 'Error deleting invitation'),
  });
};

watch(
  () => shared.errors,
  (newErrors) => {
    if (newErrors && Object.keys(newErrors).length > 0) {
      ignoreTheNextChange = true;
      isPublished.value = false;
      model.setField('isPublished', false);
    }
  },
  { deep: true },
);

const urlFieldIsDisabled = computed(() => selection.value !== 'externalUrl');

const stats = ref<InvitationStatsType>({ impressions: 0, clicks: 0 });

onMounted(async (): Promise<void> => {
  model.$subscribe(() => {
    selection.value = model.getField('actionType', defaultType);

    if (ignoreTheNextChange) {
      ignoreTheNextChange = false;
      return;
    }

    save();
    title.value = model.getField('name', 'Invitation');
    isPublished.value = Boolean(model.getField('isPublished', false));
  });

  try {
    const response = await axios.get(
      `/${shared.locale}/invitation/${props.invitation.id}/stats`,
    );
    stats.value = response.data;
  } catch (_error) {
    console.error(_error);
    shared.addMessage(ResponseStatus.Failure, 'Error getting invitation stats');
    stats.value = { impressions: 0, clicks: 0 };
  }
});
</script>

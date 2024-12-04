<template>
  <AttachmentField
    v-bind="props"
    :url="modelValue"
    :errors="errors"
    :host-service="host"
    @delete="onDelete"
    @attached="onAttached"
  >
    <RivePlayer :url="modelValue" />
  </AttachmentField>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import type { FieldSpec } from '../../types';
import { useModelStore, useSharedStore } from '../store';
import { commonProps } from '../shared/helpers';
import AttachmentField from './attachments/attachment-field.vue';
import CloudinaryService from './attachments/cloudinary-service';
import type { AttachmentModel } from './attachments/types';
import RivePlayer from './attachments/rive-player.vue';

const props = defineProps({
  ...commonProps,
});

const model = useModelStore();
const shared = useSharedStore();

const field = computed(() => props.field as FieldSpec);
const fieldPath = computed(() => {
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

const modelValue = props.isReadOnly
  ? ref(model.getSourceField(fieldPath.value, '') as string)
  : ref(model.getField(fieldPath.value, ''));

const host = new CloudinaryService(field.value, '/raw/upload');

model.$subscribe(() => {
  if (props.isReadOnly) return;

  nextTick().then(() => {
    modelValue.value = model.getField(fieldPath.value, '') as string;
  });
});
const errors = computed(() => shared.errorMessages(fieldPath.value));

const onDelete = () => {
  model.setField(fieldPath.value, '');
  nextTick().then(() => {
    modelValue.value = model.getField(fieldPath.value, '') as string;
  });
};

const onAttached = (data: AttachmentModel) => {
  model.setField(fieldPath.value, data.url);
};
</script>

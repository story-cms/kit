<template>
  <div
    :class="{
      'rounded-bl-lg rounded-br-lg bg-white px-8 py-6 shadow-sm': !isNested,
    }"
  >
    <SwitchGroup as="div" class="flex shrink-0 items-center gap-3">
      <SwitchLabel
        v-if="labelStart"
        as="span"
        class="text-xs font-medium uppercase leading-5 text-gray-900"
      >
        {{ field.label }}
      </SwitchLabel>
      <Switch
        :class="[btnClass]"
        class="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
        :disabled="props.isReadOnly"
        @click="toggle"
      >
        <span
          aria-hidden="true"
          :class="[
            isOn
              ? 'ltr:translate-x-5 rtl:-translate-x-5'
              : 'ltr:translate-x-0 rtl:-translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          ]"
        />
      </Switch>
      <SwitchLabel
        v-if="!labelStart"
        as="span"
        class="text-xs font-medium leading-5 text-gray-900"
      >
        {{ field.label }}
      </SwitchLabel>
    </SwitchGroup>
    <p v-if="hasError" class="mt-1 text-sm text-error">{{ errors[0] }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import type { FieldSpec } from '../../types';
import { useModelStore, useSharedStore } from '../store';
import { commonProps } from '../shared/helpers';

import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue';

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

if (!model.isPopulated(fieldPath.value)) {
  model.setField(fieldPath.value, field.value.default);
}

// toggle
const isOn = props.isReadOnly
  ? ref(Boolean(model.getSourceField(fieldPath.value, field.value.default)))
  : ref(Boolean(model.getField(fieldPath.value, field.value.default)));

const toggle = () => {
  if (props.isReadOnly) return;
  isOn.value = !isOn.value;
  model.setField(fieldPath.value, isOn.value);
};

model.$subscribe(() => {
  if (props.isReadOnly) return;

  nextTick().then(() => {
    isOn.value = Boolean(model.getField(fieldPath.value, field.value.default));
  });
});

// tint
const tintColor = computed(() => {
  return field.value.tintColor ? field.value.tintColor : 'indigo-600';
});

const btnClass = computed((): string => {
  const classes = isOn.value
    ? [`bg-${tintColor.value} focus:ring-${tintColor.value}`]
    : ['bg-gray-200 focus:ring-gray-200'];
  const cursor = props.isReadOnly ? 'cursor-default' : 'cursor-pointer';
  classes.push(cursor);
  return classes.join(' ');
});

// label order
const labelStart = computed((): boolean => field.value.labelOrder === 'start');

const errors = computed(() => shared.errorMessages(fieldPath.value));
const hasError = computed(() => errors.value.length > 0 && !props.isReadOnly);
</script>

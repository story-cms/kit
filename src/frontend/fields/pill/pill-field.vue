<template>
  <div
    :class="{
      'rounded border border-gray-200 bg-white p-8 drop-shadow-sm': !isNested,
      'mt-4': isNested,
    }"
  >
    <label
      :for="field.label"
      class="input-label"
      :class="{ 'text-gray-600': isReadOnly }"
    >
      {{ field.label }}
    </label>

    <div class="relative">
      <div
        class="mt-[2px] grid gap-x-1 rounded-md border border-gray-300 bg-white pb-1 pt-1"
        :class="
          (pills.length > 0 || showDefaultPill) && !isReadOnly
            ? 'grid-cols-[auto_minmax(32%,_1fr)]'
            : 'grid-cols-[1fr]'
        "
      >
        <div
          class="flex flex-wrap items-center gap-2 text-base text-gray-500 sm:text-sm/6"
          :class="pills.length > 0 ? 'ltr:pl-1 rtl:pr-1' : 'px-0'"
          @click="inputRef?.focus()"
        >
          <span v-if="showDefaultPill">
            <span
              class="ml-1 inline-flex flex-wrap items-center gap-1 rounded-full px-2 py-1 text-xs font-medium leading-4"
              :class="[pillBgColor, pillTextColor]"
            >
              {{ getDisplayText(defaultPill) }}
            </span>
          </span>
          <span
            v-for="pill in pills"
            :key="pill"
            class="inline-flex flex-wrap items-center gap-1 rounded-full px-2 py-1 text-xs font-medium leading-4"
            :class="[pillBgColor, pillTextColor]"
          >
            {{ getDisplayText(pill) }}
            <button
              role="button"
              type="button"
              :disabled="isReadOnly"
              @click="handleRemove(pill)"
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.64645 0.646447C6.84171 0.451184 7.15822 0.451185 7.35348 0.646447C7.54874 0.841709 7.54874 1.15822 7.35348 1.35348L4.70699 3.99996L7.35348 6.64645L7.38766 6.68453C7.54783 6.88092 7.53654 7.17042 7.35348 7.35348C7.17042 7.53654 6.88092 7.54783 6.68453 7.38766L6.64645 7.35348L3.99996 4.70699L1.35348 7.35348C1.15822 7.54874 0.841709 7.54874 0.646447 7.35348C0.451185 7.15822 0.451184 6.84171 0.646447 6.64645L3.29293 3.99996L0.646447 1.35348L0.612267 1.31539C0.452092 1.119 0.463389 0.829504 0.646447 0.646447C0.829504 0.463389 1.119 0.452092 1.31539 0.612267L1.35348 0.646447L3.99996 3.29293L6.64645 0.646447Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </span>
        </div>
        <slot name="input">
          <input
            v-if="!isReadOnly && showInput"
            ref="inputRef"
            :value="inputValue"
            type="text"
            autocomplete="off"
            :name="field.label"
            :placeholder="showPlaceholder ? placeholder : ''"
            class="block rounded-r-md border-0 bg-white py-1 pl-0 text-sm font-normal leading-5 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white"
            :class="
              pills.length > 0
                ? 'ltr:ml-1 ltr:pr-0'
                : 'ltr:ml-1 ltr:pr-0 rtl:mr-1 rtl:pl-0'
            "
            @input="handleInputEvent"
            @keydown.enter.stop="handleEnterKey"
            @keydown.arrow-down.prevent="handleArrowDown"
            @keydown.arrow-up.prevent="handleArrowUp"
            @keydown.escape="handleEscape"
            @focus="handleFocus"
            @blur="handleBlur"
          />
        </slot>
      </div>
      <slot name="dropdown"></slot>
    </div>
    <p v-if="hasError" class="text-sm text-error">{{ errors[0] }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { PropType } from 'vue';
import type { FieldSpec } from '../../../types';
import { commonProps } from '../../shared/helpers';

const props = defineProps({
  ...commonProps,

  pills: {
    type: Array as PropType<string[]>,
    required: true,
  },

  pillBgColor: {
    type: String,
    default: 'bg-[#E0F2FE]',
  },

  pillTextColor: {
    type: String,
    default: 'text-blue-800',
  },

  displayText: {
    type: Function as PropType<(pill: string) => string>,
    default: (pill: string) => pill,
  },

  errors: {
    type: Array as PropType<string[]>,
    default: () => [],
  },

  inputValue: {
    type: String,
    default: '',
  },

  showInput: {
    type: Boolean,
    default: true,
  },

  placeholder: {
    type: String,
    default: '',
  },
  defaultPill: {
    type: String,
    default: '',
    required: false,
  },
});

const emit = defineEmits<{
  add: [value: string];
  remove: [value: string];
  update: [value: string];
  'keydown:enter': [event: KeyboardEvent];
  'keydown:arrow-down': [event: KeyboardEvent];
  'keydown:arrow-up': [event: KeyboardEvent];
  'keydown:escape': [event: KeyboardEvent];
  input: [event: Event];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const field = computed(() => props.field as FieldSpec);
const inputRef = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);

const hasError = computed(() => props.errors.length > 0 && !props.isReadOnly);

const showPlaceholder = computed(() => {
  return props.pills.length === 0 && !isFocused.value && props.placeholder !== '';
});

const getDisplayText = (pill: string) => {
  return props.displayText(pill);
};

const handleRemove = (pill: string) => {
  if (!props.isReadOnly) {
    emit('remove', pill);
  }
};

const handleEnterKey = (event: KeyboardEvent) => {
  emit('keydown:enter', event);
  if (props.inputValue.trim()) {
    emit('add', props.inputValue.trim());
    emit('update', '');
  }
};

const handleInputEvent = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update', value);
  emit('input', event);
};

const handleArrowDown = (event: KeyboardEvent) => {
  emit('keydown:arrow-down', event);
};

const handleArrowUp = (event: KeyboardEvent) => {
  emit('keydown:arrow-up', event);
};

const handleEscape = (event: KeyboardEvent) => {
  emit('keydown:escape', event);
};

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false;
  emit('blur', event);
};

// Expose inputRef for parent components
defineExpose({
  inputRef,
});

const showDefaultPill = computed(() => {
  return props.pills.length === 0 && props.defaultPill !== '' && !isFocused.value;
});
</script>

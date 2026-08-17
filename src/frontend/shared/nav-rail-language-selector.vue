<template>
  <Listbox
    v-model="model"
    as="div"
    :class="variant === 'pill' ? 'relative inline-block' : 'relative'"
  >
    <ListboxButton :disabled="isReadOnly" :class="triggerClasses">
      <template v-if="variant === 'panel'">
        <div class="flex items-center gap-2">
          <Icon name="translate" class="size-6 shrink-0" />
          <LanguageOptionLabel v-if="selectedLanguage" :spec="selectedLanguage" />
        </div>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <Icon
            v-if="!isReadOnly"
            class="size-6 text-gray-700"
            aria-hidden="true"
            name="chevron-down"
          />
        </span>
      </template>
      <template v-else>
        <span
          class="absolute right-2 top-4 rounded-xl bg-studio-lime px-1 py-[2px] text-[8px] font-medium uppercase leading-[9.36px] text-studio-forest"
        >
          {{ currentLocale }}
        </span>
        <Languages class="size-6" aria-hidden="true" />
      </template>
    </ListboxButton>

    <transition
      :leave-active-class="
        variant === 'pill'
          ? 'transition duration-75 ease-in'
          : 'transition duration-100 ease-in'
      "
      leave-from-class="opacity-100"
      :leave-to-class="variant === 'pill' ? 'opacity-0 transform scale-95' : 'opacity-0'"
    >
      <ListboxOptions :class="optionsClasses">
        <ListboxOption
          v-for="language in languages"
          :key="language.locale"
          v-slot="{ active, selected }"
          as="template"
          :value="language.language"
          @click="emit('change', language.language)"
        >
          <li :class="rowClasses(active, selected)">
            <LanguageOptionLabel :spec="language" />
            <span
              v-if="selected"
              class="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <Check class="size-4 text-gray-900" aria-hidden="true" />
            </span>
          </li>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import type { PropType } from 'vue';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { Check, Languages } from '@lucide/vue';
import type { LanguageSpecification } from '../../types';
import Icon from './icon.vue';
import LanguageOptionLabel from './language-option-label.vue';

const props = defineProps({
  variant: {
    type: String as PropType<'panel' | 'pill'>,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  currentLocale: {
    type: String,
    default: '',
  },
  languages: {
    type: Array as PropType<LanguageSpecification[]>,
    required: true,
  },
  isReadOnly: {
    type: Boolean,
    default: false,
  },
});

const model = toRef(props, 'modelValue');

const selectedLanguage = computed(() =>
  props.languages.find((language) => language.language === model.value),
);

const triggerClasses = computed(() => {
  if (props.variant === 'panel') {
    return [
      'relative w-full cursor-default rounded-xl py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-1',
      props.isReadOnly ? 'bg-gray-100' : 'glass-surface',
    ];
  }

  return [
    'relative flex size-14 items-center justify-center rounded-full transition-all duration-75 hover:bg-gray-100 focus:outline-none',
  ];
});

const optionsClasses = computed(() => {
  const shared =
    'absolute z-10 overflow-auto rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm';

  if (props.variant === 'panel') {
    return [
      shared,
      'bottom-full mb-1 max-h-[calc(100vh-10rem)] min-w-[18rem] text-base ring-opacity-5',
    ];
  }

  return [shared, 'left-0 top-full mt-1 max-h-[calc(100vh-240px)] w-56 origin-top-right'];
});

const rowClasses = (active: boolean, selected: boolean) => [
  selected ? 'bg-slate-50' : active ? 'bg-slate-100' : '',
  'relative cursor-default select-none rounded-lg px-3 py-3 pr-10',
];

const emit = defineEmits<{
  (e: 'change', language: string): void;
}>();
</script>

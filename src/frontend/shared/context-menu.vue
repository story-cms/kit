<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        :disabled="!hasOptions"
        class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        {{ anchor }}
        <Icon
          v-if="hasOptions"
          class="h-5 w-5 text-gray-700"
          aria-hidden="true"
          name="chevron-down"
        />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
          <MenuItem v-for="item in options" :key="item" v-slot="{ active }">
            <button
              type="button"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'flex w-full items-start px-4 py-2 text-sm',
              ]"
              @click="emit('select', item)"
            >
              {{ item }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import Icon from './icon.vue';

const props = defineProps({
  options: {
    type: Array as PropType<string[]>,
    required: true,
  },
  anchor: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['select']);
const hasOptions = computed(() => props.options.length > 1);
</script>

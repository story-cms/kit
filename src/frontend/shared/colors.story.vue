<template>
  <Story title="Colors" group="shared">
    <Variant title="Palette">
      <div class="space-y-12 p-8">
        <section v-for="section in sections" :key="section.title">
          <h2 class="mb-6 text-lg font-semibold text-gray-900">{{ section.title }}</h2>
          <div class="flex flex-wrap gap-8">
            <div
              v-for="color in section.colors"
              :key="color.name"
              class="flex flex-col gap-2"
            >
              <div class="size-80 rounded-xl shadow-md" :class="color.class" />
              <p class="text-sm font-medium text-gray-900">{{ color.name }}</p>
              <p v-if="color.hex" class="text-xs text-gray-500">{{ color.hex }}</p>
            </div>
          </div>
        </section>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
type ColorSwatch = {
  name: string;
  class?: string;
  style?: string;
  hex?: string;
};

type ColorSection = {
  title: string;
  colors: ColorSwatch[];
};

const sections: ColorSection[] = [
  {
    title: 'Brand',
    colors: [
      { name: 'tertiary', class: 'bg-tertiary', hex: '#649ABB' },
      { name: 'purple', class: 'bg-purple', hex: '#B88C9E' },
      { name: 'black', class: 'bg-black', hex: '#2E2D2C' },
      { name: 'neutral', class: 'bg-neutral', hex: '#F1F0EA' },
      { name: 'app_gray', class: 'bg-app_gray', hex: '#F9FAFB' },
      { name: 'app_green', class: 'bg-app_green', hex: '#16A34A' },
      { name: 'error', class: 'bg-error', hex: 'red-500' },
      { name: 'white', class: 'bg-white', hex: '#FFFFFF' },
    ],
  },
  {
    title: 'Accent',
    colors: [
      { name: 'accent', class: 'bg-accent', hex: '#39CCFB' },
      { name: 'accent-one', class: 'bg-accent-one', hex: '#FF7070' },
      { name: 'accent-green', class: 'bg-accent-green', hex: '#34D399' },
      { name: 'accent-orange', class: 'bg-accent-orange', hex: '#FB923C' },
      { name: 'accent-gray', class: 'bg-accent-gray', hex: '#E2E8F0' },
      { name: 'accent-pink', class: 'bg-accent-pink', hex: '#EC4899' },
    ],
  },
  {
    title: 'Studio',
    colors: [
      { name: 'studio_forest_green', class: 'bg-studio_forest_green', hex: '#102F35' },
      { name: 'studio_lime', class: 'bg-studio_lime', hex: '#D7FE96' },
    ],
  },
  {
    title: 'CSS Variables',
    colors: [
      {
        name: '--primary-color',
        style: 'background: var(--primary-color)',
        hex: '#39CCFB',
      },
      {
        name: '--secondary-color',
        style: 'background: var(--secondary-color)',
        hex: '#34D399',
      },
    ],
  },
  {
    title: 'Gray',
    colors: [
      { name: 'gray-50', class: 'bg-gray-50' },
      { name: 'gray-100', class: 'bg-gray-100' },
      { name: 'gray-200', class: 'bg-gray-200' },
      { name: 'gray-300', class: 'bg-gray-300' },
      { name: 'gray-400', class: 'bg-gray-400' },
      { name: 'gray-500', class: 'bg-gray-500' },
      { name: 'gray-600', class: 'bg-gray-600' },
      { name: 'gray-700', class: 'bg-gray-700' },
      { name: 'gray-800', class: 'bg-gray-800' },
      { name: 'gray-900', class: 'bg-gray-900' },
    ],
  },
  {
    title: 'Blue',
    colors: [
      { name: 'blue-50', class: 'bg-blue-50' },
      { name: 'blue-100', class: 'bg-blue-100' },
      { name: 'blue-500', class: 'bg-blue-500' },
      { name: 'blue-600', class: 'bg-blue-600' },
      { name: 'blue-700', class: 'bg-blue-700' },
      { name: 'blue-800', class: 'bg-blue-800' },
    ],
  },
  {
    title: 'Green',
    colors: [
      { name: 'green-100', class: 'bg-green-100' },
      { name: 'green-500', class: 'bg-green-500' },
      { name: 'green-600', class: 'bg-green-600' },
      { name: 'green-800', class: 'bg-green-800' },
    ],
  },
  {
    title: 'Red',
    colors: [
      { name: 'red-50', class: 'bg-red-50' },
      { name: 'red-500', class: 'bg-red-500' },
    ],
  },
  {
    title: 'Yellow',
    colors: [
      { name: 'yellow-500', class: 'bg-yellow-500' },
      { name: 'yellow-800', class: 'bg-yellow-800' },
    ],
  },
  {
    title: 'Indigo',
    colors: [
      { name: 'indigo-50', class: 'bg-indigo-50' },
      { name: 'indigo-500', class: 'bg-indigo-500' },
      { name: 'indigo-600', class: 'bg-indigo-600' },
      { name: 'indigo-700', class: 'bg-indigo-700' },
    ],
  },
];
</script>

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
              class="flex w-80 flex-col gap-2"
            >
              <div
                class="size-80 rounded-xl border border-gray-200 shadow-md"
                :class="color.class"
                :style="color.style"
              />
              <p class="text-sm font-medium text-gray-900">{{ color.name }}</p>
              <p v-if="color.hex" class="text-xs text-gray-500">{{ color.hex }}</p>
              <template v-if="colorUsage[color.name]?.count">
                <p class="text-xs text-gray-500">
                  Used {{ colorUsage[color.name].count }} times in
                  {{ colorUsage[color.name].files.length }} files
                </p>
                <ul class="max-h-24 list-none overflow-y-auto text-xs text-gray-400">
                  <li v-for="file in colorUsage[color.name].files" :key="file">
                    {{ file }}
                  </li>
                </ul>
              </template>
              <p v-else class="text-xs text-gray-400">No uses found</p>
            </div>
          </div>
        </section>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { colorSections } from './colors.palette';
import { colorUsage } from './colors.usage';

const sections = colorSections;
</script>

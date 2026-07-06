<template>
  <Story title="Glass Button" group="shared" :layout="{ type: 'grid', width: 400 }">
    <Variant title="Default">
      <div class="bg-gray-50 p-6">
        <GlassButton label="Live" :count="15" />
      </div>
    </Variant>

    <Variant title="Active">
      <div class="bg-gray-50 p-6">
        <GlassButton label="Draft" :count="156" :active="true" />
      </div>
    </Variant>

    <Variant title="Interactive demo">
      <div class="space-y-4 bg-gray-50 p-6">
        <div class="flex flex-wrap items-center gap-3">
          <GlassButton
            label="Live"
            :count="15"
            :active="currentTab === 'Live'"
            @click="currentTab = 'Live'"
          />
          <GlassButton
            label="Draft"
            :count="156"
            :active="currentTab === 'Draft'"
            @click="currentTab = 'Draft'"
          />
        </div>
        <p class="text-sm text-gray-600">Selected: {{ currentTab }}</p>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GlassButton from './glass-button.vue';

const currentTab = ref('Live');
</script>

<template>
  <Story title="Tab Button" group="shared" :layout="{ type: 'grid', width: 500 }">
    <Variant title="Settings tabs">
      <div class="rounded-xl p-4">
        <div class="flex flex-wrap items-center gap-1">
          <TabButton
            v-for="tab in tabs"
            :key="tab.id"
            :label="tab.label"
            :is-active="activeTab === tab.id"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" />
          </TabButton>
        </div>
      </div>
    </Variant>

    <Variant title="On glass header">
      <div
        class="rounded-xl border border-white bg-white/50 p-4 shadow-[0_4px_50px_rgba(16,47,53,0.05)] backdrop-blur-[20px]"
      >
        <div class="flex flex-wrap items-center gap-1">
          <TabButton
            v-for="tab in tabs"
            :key="tab.id"
            :label="tab.label"
            :is-active="activeTab === tab.id"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" />
          </TabButton>
        </div>
      </div>
    </Variant>

    <Variant title="Icon only">
      <div class="flex items-center gap-1 rounded-xl p-4">
        <TabButton :is-active="false" @click="activeTab = 'account'">
          <IdCard />
        </TabButton>
        <TabButton :is-active="true" @click="activeTab = 'languages'">
          <Languages />
        </TabButton>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IdCard, Languages, Users } from '@lucide/vue';
import TabButton from './tab-button.vue';

const tabs = [
  { id: 'account', label: 'Account', icon: IdCard },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'languages', label: 'Languages', icon: Languages },
] as const;

const activeTab = ref<(typeof tabs)[number]['id']>('languages');
</script>

<docs lang="md">
# Tab Button

Pill-shaped tab control for settings and section navigation.

## Usage

```vue
<TabButton label="Languages" :is-active="true" @click="selectLanguages">
  <Languages />
</TabButton>
```

## Props

- `label` - Optional tab label text
- `isActive` - Whether the tab is currently selected

## Events

- `click` - Emitted when the tab is clicked
</docs>

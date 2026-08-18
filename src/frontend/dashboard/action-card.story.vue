<template>
  <Story title="Action card" group="dashboard" :layout="{ type: 'grid', width: 360 }">
    <Variant title="New Language">
      <ActionCard
        :icon="Languages"
        title="New Language"
        description="Engage your audience morning, noon, and night. Create healthy daily rhythms with content that reaches them throughout the day."
        @action="handleAction"
      />
    </Variant>

    <Variant title="New Story">
      <ActionCard
        :icon="BookOpen"
        title="New Story"
        description="Engage your audience morning, noon, and night. Create healthy daily rhythms with content that reaches them throughout the day."
        @action="handleAction"
      />
    </Variant>

    <Variant title="New Page">
      <ActionCard
        :icon="FileText"
        title="New Page"
        description="Engage your audience morning, noon, and night. Create healthy daily rhythms with content that reaches them throughout the day."
        @action="handleAction"
      />
    </Variant>
    <Variant title="New Page disabled">
      <ActionCard
        :icon="FileText"
        title="New Page"
        description="Engage your audience morning, noon, and night. Create healthy daily rhythms with content that reaches them throughout the day."
        @action="handleAction"
        disabled
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { BookOpen, FileText, Languages } from '@lucide/vue';
import ActionCard from './action-card.vue';

const handleAction = () => {
  console.log('Action card clicked');
};
</script>

<template>
  <Story title="Ring" group="dashboard" :layout="{ type: 'grid', width: 200 }">
    <Variant title="Started">
      <Ring
        name="Deutsch"
        :done="50"
        :draft="20"
        :total="100"
        last-updated="2025-07-16"
      />
    </Variant>

    <Variant title="Not started">
      <Ring name="Deutsch" :done="0" :draft="0" :total="110" last-updated="2025-07-16" />
    </Variant>

    <Variant title="Done">
      <Ring
        name="Deutsch"
        :done="100"
        :draft="0"
        :total="100"
        last-updated="2025-07-16"
      />
    </Variant>

    <Variant title="Done not QAed">
      <Ring
        name="Deutsch"
        :done="80"
        :draft="20"
        :total="100"
        last-updated="2025-07-16"
      />
    </Variant>

    <Variant title="Overdone">
      <Ring
        name="Deutsch"
        :done="100"
        :draft="50"
        :total="120"
        last-updated="2025-07-16"
      />
    </Variant>

    <Variant title="Error: Total is 0">
      <Ring name="Deutsch" :done="0" :draft="0" :total="0" last-updated="2025-07-16" />
    </Variant>

    <Variant title="Error: data is garbage">
      <Ring
        name="Deutsch"
        done="something"
        :draft="50"
        :total="0"
        last-updated="2025-07-16"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import Ring from './ring.vue';
</script>

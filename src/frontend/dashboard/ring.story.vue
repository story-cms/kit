<template>
  <Story title="Ring" group="dashboard" :layout="{ type: 'grid', width: 200 }">
    <Variant title="Started">
      <div class="bg-white p-8">
        <Ring
          name="Deutsch"
          :done="50"
          :draft="20"
          :total="100"
          last-updated="2025-07-16"
        />
      </div>
    </Variant>

    <Variant title="Not started">
      <div class="bg-white p-8">
        <Ring
          name="Deutsch"
          :done="0"
          :draft="0"
          :total="110"
          last-updated="2025-07-16"
        />
      </div>
    </Variant>

    <Variant title="Done">
      <div class="bg-white p-8">
        <Ring
          name="Deutsch"
          :done="100"
          :draft="0"
          :total="100"
          last-updated="2025-07-16"
        />
      </div>
    </Variant>

    <Variant title="Done not QAed">
      <div class="bg-white p-8">
        <Ring
          name="Deutsch"
          :done="80"
          :draft="20"
          :total="100"
          last-updated="2025-07-16"
        />
      </div>
    </Variant>

    <Variant title="Overdone">
      <div class="bg-white p-8">
        <Ring
          name="Deutsch"
          :done="100"
          :draft="50"
          :total="120"
          last-updated="2025-07-16"
        />
      </div>
    </Variant>

    <Variant title="Error: Total is 0">
      <div class="bg-white p-8">
        <Ring name="Deutsch" :done="0" :draft="0" :total="0" last-updated="2025-07-16" />
      </div>
    </Variant>

    <Variant title="Error: data is garbage">
      <div class="bg-white p-8">
        <Ring
          name="Deutsch"
          :done="NaN"
          :draft="50"
          :total="0"
          last-updated="2025-07-16"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import Ring from './ring.vue';
</script>

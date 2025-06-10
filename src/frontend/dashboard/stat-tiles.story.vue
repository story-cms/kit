<template>
  <Story title="Analytic Stats" group="dashboard">
    <Variant title="Analytic stats">
      <StatTiles :stats="[]" :is-loading="false" :error="null" />
    </Variant>
    <Variant title="Analytic stats loading">
      <StatTiles :stats="[]" :is-loading="true" :error="null" />
    </Variant>
    <Variant title="Stats tile">
      <StatsTile :metric="{ name: 'Total Stories', stat: 71897, previousStat: 70946 }" />
    </Variant>
    <Variant title="Stats tile loading">
      <StatsTile
        :metric="{
          name: '',
          stat: 0,
          previousStat: 0,
        }"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StatTiles from './stat-tiles.vue';
import StatsTile from './stat-tile.vue';
</script>

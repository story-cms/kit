<template>
  <Story title="Stat tiles" group="dashboard">
    <Variant title="Stat tile">
      <StatsTile :metric="{ name: 'Total Stories', stat: 71897, previousStat: 70946 }" />
    </Variant>
    <Variant title="Stat tiles">
      <StatTiles :stats="stats" :is-loading="false" :error="null" />
    </Variant>
    <Variant title="Stat tiles loading">
      <StatTiles :stats="stats" :is-loading="true" :error="null" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StatTiles from './stat-tiles.vue';
import StatsTile from './stat-tile.vue';
const stats = [
  {
    name: 'Total Installs',
    stat: 3950,
    previousStat: 3571,
  },
  {
    name: 'Monthly Active Users',
    stat: 3771,
    previousStat: 3412,
  },
  {
    name: 'Chapters Complete',
    stat: 2738,
    previousStat: 2772,
  },
];
</script>

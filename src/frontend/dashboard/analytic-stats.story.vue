<template>
  <Story title="Analytic Stats" group="dashboard">
    <Variant title="Analytic stats">
      <AnalyticStats
        :analytics-report="{
          totalInstalls: { current: 71897, previous: 70946 },
          monthlyActiveUsers: { current: 70897, previous: 70956 },
          chaptersComplete: { current: 71897, previous: 72946 },
        }"
        :is-loading="false"
        :error="null"
      />
    </Variant>
    <Variant title="Analytic stats loading">
      <AnalyticStats
        :analytics-report="{
          totalInstalls: { current: 0, previous: 0 },
          monthlyActiveUsers: { current: 0, previous: 0 },
          chaptersComplete: { current: 0, previous: 0 },
        }"
        :is-loading="true"
        :error="null"
      />
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
import AnalyticStats from './analytic-stats.vue';
import StatsTile from './stats-tile.vue';
</script>

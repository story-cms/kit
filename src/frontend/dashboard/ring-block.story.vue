<template>
  <Story title="Ring block" group="dashboard" :layout="{ type: 'grid', width: 350 }">
    <Variant title="Incomplete">
      <div class="bg-white p-8">
        <RingBlock
          :progress="[
            { name: 'Interface', done: 75, draft: 0, total: 100 },
            { name: 'Content', done: 100, draft: 20, total: 100 },
          ]"
        />
      </div>
    </Variant>

    <Variant title="All done">
      <div class="bg-white p-8">
        <RingBlock
          :progress="[
            { name: 'Interface', done: 100, draft: 50, total: 100 },
            { name: 'Content', done: 300, draft: 10, total: 300 },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Not started">
      <div class="bg-white p-8">
        <RingBlock
          :progress="[
            { name: 'Interface', done: 0, draft: 0, total: 100 },
            { name: 'Content', done: 0, draft: 0, total: 300 },
          ]"
        />
      </div>
    </Variant>

    <Variant title="In progress">
      <div class="bg-white p-8">
        <RingBlock
          :progress="[
            { name: 'Interface', done: 50, draft: 10, total: 100 },
            { name: 'Content', done: 150, draft: 0, total: 300 },
          ]"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import RingBlock from './ring-block.vue';
</script>

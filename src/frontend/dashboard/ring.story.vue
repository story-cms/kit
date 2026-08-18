<template>
  <Story title="Ring" group="dashboard" :layout="{ type: 'grid', width: 350 }">
    <Variant title="Card: started">
      <div class="bg-white p-8">
        <Ring
          size="card"
          label-position="bottom"
          name="Deutsch"
          :done="50"
          :draft="20"
          :total="100"
          last-updated="2025-07-16"
        />
      </div>
    </Variant>

    <Variant title="Card: not started">
      <div class="bg-white p-8">
        <Ring
          size="card"
          label-position="bottom"
          name="Deutsch"
          :done="0"
          :draft="0"
          :total="110"
          last-updated="2025-07-16"
        />
      </div>
    </Variant>

    <Variant title="Card: done">
      <div class="bg-white p-8">
        <Ring
          size="card"
          label-position="bottom"
          name="Deutsch"
          :done="100"
          :draft="0"
          :total="100"
          last-updated="2025-07-16"
        />
      </div>
    </Variant>

    <Variant title="Card: done not QAed">
      <div class="bg-white p-8">
        <Ring
          size="card"
          label-position="bottom"
          name="Deutsch"
          :done="80"
          :draft="20"
          :total="100"
          last-updated="2025-07-16"
        />
      </div>
    </Variant>

    <Variant title="Card: overdone">
      <div class="bg-white p-8">
        <Ring
          size="card"
          label-position="bottom"
          name="Deutsch"
          :done="100"
          :draft="50"
          :total="120"
          last-updated="2025-07-16"
        />
      </div>
    </Variant>

    <Variant title="Card: total is 0">
      <div class="bg-white p-8">
        <Ring
          size="card"
          label-position="bottom"
          name="Deutsch"
          :done="0"
          :draft="0"
          :total="0"
          last-updated="2025-07-16"
        />
      </div>
    </Variant>

    <Variant title="Card: garbage data">
      <div class="bg-white p-8">
        <Ring
          size="card"
          label-position="bottom"
          name="Deutsch"
          :done="NaN"
          :draft="50"
          :total="0"
          last-updated="2025-07-16"
        />
      </div>
    </Variant>

    <Variant title="Compact: incomplete">
      <div class="bg-white p-8">
        <Ring
          size="compact"
          label-position="top"
          :progress="[
            { name: 'Interface', done: 75, draft: 0, total: 100 },
            { name: 'Content', done: 100, draft: 20, total: 100 },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Compact: all done">
      <div class="bg-white p-8">
        <Ring
          size="compact"
          label-position="top"
          :progress="[
            { name: 'Interface', done: 100, draft: 50, total: 100 },
            { name: 'Content', done: 300, draft: 10, total: 300 },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Compact: not started">
      <div class="bg-white p-8">
        <Ring
          size="compact"
          label-position="top"
          :progress="[
            { name: 'Interface', done: 0, draft: 0, total: 100 },
            { name: 'Content', done: 0, draft: 0, total: 300 },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Compact: in progress">
      <div class="bg-white p-8">
        <Ring
          size="compact"
          label-position="top"
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
import Ring from './ring.vue';
</script>

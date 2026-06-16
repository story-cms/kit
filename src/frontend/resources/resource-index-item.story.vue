<template>
  <Story title="Resource Index Item" group="resources" :layout="{ type: 'grid', width: 900 }">
    <Variant title="Grid / Video">
      <ResourceIndexItem
        :resource="resource('r1')"
        view-mode="grid"
        @edit="onEdit"
        @preview="onPreview"
        @delete="onDelete"
      />
    </Variant>

    <Variant title="Grid / Text">
      <ResourceIndexItem
        :resource="resource('r2')"
        view-mode="grid"
        @edit="onEdit"
        @preview="onPreview"
        @delete="onDelete"
      />
    </Variant>

    <Variant title="Grid / Info link">
      <ResourceIndexItem
        :resource="resource('r4')"
        view-mode="grid"
        @edit="onEdit"
        @preview="onPreview"
        @delete="onDelete"
      />
    </Variant>

    <Variant title="Grid / No image">
      <ResourceIndexItem
        :resource="videoWithoutImage"
        view-mode="grid"
        @edit="onEdit"
        @preview="onPreview"
        @delete="onDelete"
      />
    </Variant>

    <Variant title="Grid / Leader visibility">
      <ResourceIndexItem
        :resource="resource('r7')"
        view-mode="grid"
        @edit="onEdit"
        @preview="onPreview"
        @delete="onDelete"
      />
    </Variant>

    <Variant title="Grid / No description">
      <ResourceIndexItem
        :resource="withoutDescription"
        view-mode="grid"
        @edit="onEdit"
        @preview="onPreview"
        @delete="onDelete"
      />
    </Variant>

    <Variant title="List / Video">
      <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table class="w-full min-w-[720px] table-fixed">
          <colgroup>
            <col />
            <col class="w-20" />
            <col class="w-28" />
            <col class="w-24" />
            <col class="w-28" />
            <col class="w-32" />
          </colgroup>
          <thead class="border-b border-gray-200 bg-gray-50">
            <tr>
              <th class="max-w-0 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Resource
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Label
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Visibility
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Updated
              </th>
              <th class="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <ResourceIndexItem
              :resource="resource('r1')"
              view-mode="list"
              @edit="onEdit"
              @preview="onPreview"
              @delete="onDelete"
            />
          </tbody>
        </table>
      </div>
    </Variant>

    <Variant title="List / Text">
      <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table class="w-full min-w-[720px] table-fixed">
          <colgroup>
            <col />
            <col class="w-20" />
            <col class="w-28" />
            <col class="w-24" />
            <col class="w-28" />
            <col class="w-32" />
          </colgroup>
          <thead class="border-b border-gray-200 bg-gray-50">
            <tr>
              <th class="max-w-0 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Resource
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Label
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Visibility
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Updated
              </th>
              <th class="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <ResourceIndexItem
              :resource="resource('r2')"
              view-mode="list"
              @edit="onEdit"
              @preview="onPreview"
              @delete="onDelete"
            />
          </tbody>
        </table>
      </div>
    </Variant>

    <Variant title="List / Leader visibility">
      <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table class="w-full min-w-[720px] table-fixed">
          <colgroup>
            <col />
            <col class="w-20" />
            <col class="w-28" />
            <col class="w-24" />
            <col class="w-28" />
            <col class="w-32" />
          </colgroup>
          <thead class="border-b border-gray-200 bg-gray-50">
            <tr>
              <th class="max-w-0 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Resource
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Label
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Visibility
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Updated
              </th>
              <th class="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <ResourceIndexItem
              :resource="resource('r7')"
              view-mode="list"
              @edit="onEdit"
              @preview="onPreview"
              @delete="onDelete"
            />
          </tbody>
        </table>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import type { ResourceIndexItem as ResourceIndexItemType } from '../../types';
import ResourceIndexItem from './resource-index-item.vue';
import { mockIndexResources } from '../test/mocks';

const resource = (id: string): ResourceIndexItemType =>
  mockIndexResources.find((item) => item.id === id)!;

const videoWithoutImage: ResourceIndexItemType = {
  ...resource('r5'),
  imageUrl: undefined,
};

const withoutDescription: ResourceIndexItemType = {
  ...resource('r1'),
  description: null,
};

const onEdit = (id: string) => {
  alert(`Edit resource ${id}`);
};

const onPreview = (item: ResourceIndexItemType) => {
  alert(`Preview "${item.title}"`);
};

const onDelete = (id: string) => {
  alert(`Delete resource ${id}`);
};
</script>

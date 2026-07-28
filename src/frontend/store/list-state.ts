import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useListStateStore = defineStore('list-state', () => {
  const removedItems = ref<Record<string, number[]>>({});
  const listToggles = ref<Record<string, boolean[]>>({});

  const clearListState = (): void => {
    removedItems.value = {};
    listToggles.value = {};
  };

  const setListToggles = (path: string, value: boolean[]): void => {
    const fresh = { ...listToggles.value };
    fresh[path] = value;
    listToggles.value = fresh;
  };

  const getListToggles = (path: string): boolean[] => listToggles.value[path] || [];

  const toggleRemovedIndex = (path: string, index: number): void => {
    const fresh = { ...removedItems.value };
    fresh[path] = Array.from(removedItems.value[path] || []);
    if (fresh[path].includes(index)) {
      fresh[path].splice(fresh[path].indexOf(index), 1);
    } else {
      fresh[path].push(index);
    }
    removedItems.value = fresh;
  };

  const isInRemovedList = (path: string, index: number): boolean =>
    removedItems.value[path]?.includes(index) || false;

  return {
    removedItems,
    listToggles,
    clearListState,
    setListToggles,
    getListToggles,
    toggleRemovedIndex,
    isInRemovedList,
  };
});

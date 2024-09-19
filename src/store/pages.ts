import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PageItem } from '@/interfaces';

export const usePagesStore = defineStore('pages', () => {
  const items = ref<PageItem[]>([]);

  const setItems = (fresh: PageItem[]) => {
    items.value = fresh;
  };

  const addDivider = () => {
    items.value.push(<PageItem>{
      id: newId(),
      isDivider: true,
      isPublished: true,
    });
  };

  const deleteDivider = (id: number) => {
    items.value = items.value.filter((item) => item.id !== id);
  };

  // get the next available id one higher than items max id
  const newId = () => {
    const maxId = items.value.reduce((max, item) => Math.max(max, item.id), 0);
    return maxId + 1;
  };

  return {
    items,
    setItems,
    addDivider,
    deleteDivider,
  };
});

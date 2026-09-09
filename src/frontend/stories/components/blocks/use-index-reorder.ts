import { ref } from 'vue';

export function useIndexReorder<T>(
  getList: () => T[],
  setList: (next: T[]) => void,
  getAux?: () => boolean[],
  setAux?: (next: boolean[]) => void,
) {
  const dragFromIndex = ref<number | null>(null);

  const onDragStart = (index: number) => {
    dragFromIndex.value = index;
  };

  const onDragEnd = () => {
    dragFromIndex.value = null;
  };

  const onDrop = (toIndex: number) => {
    if (dragFromIndex.value === null) return;
    if (dragFromIndex.value === toIndex) return;

    const list = [...getList()];
    const [moved] = list.splice(dragFromIndex.value, 1);
    if (!moved) return;
    list.splice(toIndex, 0, moved);
    setList(list);

    if (getAux && setAux) {
      const aux = [...getAux()];
      const [movedAux] = aux.splice(dragFromIndex.value, 1);
      aux.splice(toIndex, 0, movedAux ?? false);
      setAux(aux);
    }

    dragFromIndex.value = null;
  };

  return { dragFromIndex, onDragStart, onDrop, onDragEnd };
}

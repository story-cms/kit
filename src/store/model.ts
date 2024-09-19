import { defineStore } from 'pinia';
import { ref, toRefs } from 'vue';
import type { Scripture, SharedPageProps, DraftEditProps } from '@/interfaces';

export const useModelStore = defineStore('model', () => {
  const model = ref({});

  const resolvePath = (
    object: Record<string | number, any>,
    path: string,
    defaultValue: any = {},
  ): any =>
    path
      .split('.')
      .reduce((o, p) => (o ? (o[p] ? o[p] : defaultValue) : defaultValue), object);

  const readPath = (path: string): any =>
    path.split('.').reduce((o: Record<string, any>, p) => {
      if (o === undefined) return undefined;
      if (!Object.hasOwn(o, p)) return undefined;
      return o[p];
    }, model.value);

  const setField = (path: string, value: any) => {
    const object = JSON.parse(JSON.stringify(model.value));
    path
      .split('.')
      .reduce(
        (o, p, i) => (o[p] = path.split('.').length === ++i ? value : o[p] || {}),
        object,
      );
    model.value = object;
  };

  const removeListItem = (path: string, index: number) => {
    const list = resolvePath(model.value, path, []) as any[];
    list.splice(index, 1);
    setField(path, list);
  };

  const addListItem = (path: string) => {
    const list = resolvePath(model.value, path, []) as any[];
    list.push({});
    setField(path, list);
  };

  const getField = (path: string, defaultValue: any = {}) =>
    resolvePath(model.value, path, defaultValue);

  const setModel = (fresh: object) => {
    model.value = fresh;
  };

  const isPopulated = (path: string): boolean => readPath(path) !== undefined;

  // translation source

  const source = ref({});

  const setSource = (fresh: object) => {
    source.value = fresh;
  };

  const getSourceField = (path: string, defaultValue: any = {}) =>
    resolvePath(source.value, path, defaultValue);

  // field specific

  const updateVerse = (path: string, verse: string) => {
    const scripture = getField(path, {}) as Scripture;
    scripture.verse = verse;
    setField(path, scripture);
  };

  const updateReference = (path: string, reference: string) => {
    const scripture = getField(path, {}) as Scripture;
    scripture.reference = reference;
    setField(path, scripture);
  };

  const setFromProps = (props: DraftEditProps & SharedPageProps) => {
    if (props.bundle) {
      model.value = toRefs(props.bundle);
    }

    if (props.source) {
      source.value = toRefs(props.source);
    }
  };

  return {
    model,
    getField,
    setField,
    updateVerse,
    updateReference,
    addListItem,
    removeListItem,
    setModel,
    isPopulated,
    source,
    setSource,
    getSourceField,
    setFromProps,
  };
});

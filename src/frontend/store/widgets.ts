import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { WidgetPicker, Providers } from '../../types';
import { widgetField } from '../fields/widget-fields';
import { useListStateStore } from './list-state';

const defaultProviders: Providers = {
  s3: {
    accessKeyId: '',
    accessKey: '',
    bucket: '',
    region: '',
    endpoint: '',
    folder: '',
  },
  cloudinary: {
    apiKey: '',
    secret: '',
    cloudName: '',
    defaultPreset: '',
  },
  scripture: {
    bibleApiKey: '',
  },
  bunny: {
    accessKey: '',
    libraryId: '',
    host: '',
  },
};

export const useWidgetsStore = defineStore('widgets', () => {
  const listState = useListStateStore();

  // widget picker

  const standardPicker = (widget: string) => widgetField(widget);
  const picker = ref<WidgetPicker>(standardPicker);

  const setPicker = (fresh: WidgetPicker) => {
    picker.value = fresh;
  };

  // track folding and removed items in flexible lists

  const getListToggles = (path: string): boolean[] => listState.getListToggles(path);
  const setListToggles = (path: string, value: boolean[]): void => {
    listState.setListToggles(path, value);
  };
  const toggleRemovedIndex = (path: string, index: number): void => {
    listState.toggleRemovedIndex(path, index);
  };
  const isInRemovedList = (path: string, index: number): boolean =>
    listState.isInRemovedList(path, index);
  const clearListState = (): void => {
    listState.clearListState();
  };

  // providers

  const providers = ref<Providers>(defaultProviders);
  const setProviders = (fresh: Providers) => {
    providers.value = fresh;
  };

  const isDirty = ref(false);
  const setIsDirty = (fresh: boolean) => {
    isDirty.value = fresh;
  };

  // custom components
  const customComponents = ref<string[]>([]);

  const setCustomComponents = (fresh: string[]) => {
    customComponents.value = fresh;
  };

  return {
    picker,
    setPicker,
    standardPicker,

    getListToggles,
    setListToggles,
    toggleRemovedIndex,
    isInRemovedList,
    clearListState,

    setProviders,
    providers,

    isDirty,
    setIsDirty,

    customComponents,
    setCustomComponents,
  };
});

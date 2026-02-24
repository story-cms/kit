import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { WidgetPicker, Providers } from '../../types';
import { widgetField } from '../fields/widget-fields';

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
  // widget picker

  const standardPicker = (widget: string) => widgetField(widget);
  const picker = ref<WidgetPicker>(standardPicker);

  const setPicker = (fresh: WidgetPicker) => {
    picker.value = fresh;
  };

  // list toggles

  const listToggles = ref<Record<string, boolean[]>>({});
  const setListToggles = (path: string, value: boolean[]): void => {
    const fresh = { ...listToggles.value };
    fresh[path] = value;
    listToggles.value = fresh;
  };
  const getListToggles = (path: string): boolean[] => listToggles.value[path] || [];

  // list removed (for flat-list flexible translation items)

  const listRemoved = ref<Record<string, boolean[]>>({});
  const setListRemoved = (path: string, value: boolean[]): void => {
    const fresh = { ...listRemoved.value };
    fresh[path] = value;
    listRemoved.value = fresh;
  };
  const getListRemoved = (path: string): boolean[] => listRemoved.value[path] || [];

  // providers

  const providers = ref<Providers>(defaultProviders);
  const setProviders = (fresh: Providers) => {
    providers.value = fresh;
  };

  const isDirty = ref(false);
  const setIsDirty = (fresh: boolean) => {
    isDirty.value = fresh;
  };

  return {
    picker,
    setPicker,
    standardPicker,

    getListToggles,
    setListToggles,

    getListRemoved,
    setListRemoved,

    setProviders,
    providers,

    isDirty,
    setIsDirty,
  };
});

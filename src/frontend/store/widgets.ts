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

    setProviders,
    providers,

    isDirty,
    setIsDirty,

    customComponents,
    setCustomComponents,
  };
});

<template>
  <div class="bg-mobile-preview relative grid h-[844px] w-full place-content-center">
    <div
      ref="flutterTarget"
      class="h-[812px] w-[375px] transition-all [&>flutter-view]:rounded-[3.25rem]"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

declare global {
  interface Window {
    _flutter: any;
    _appState: any;
  }
}

const flutterTarget = ref(null);

const props = defineProps({
  bundle: {
    type: Object,
    required: true,
  },
  number: {
    type: Number,
    default: 1,
  },
});

const loadEpisode = (bundle: any) => {
  const data = bundle;
  data['number'] = props.number;
  window._appState.setEpisode(JSON.stringify(data));
};

watch(
  () => props.bundle,
  (newBundle, oldBundle) => {
    if (newBundle !== oldBundle) {
      loadEpisode(newBundle);
    }
  },
);

const flutterLoader = () => {
  const target = flutterTarget.value;
  if (!target) {
    throw new Error('Flutter target not found');
  }
  const _flutter: any = window._flutter || {};
  _flutter.loader.loadEntrypoint({
    onEntrypointLoaded: async (engineInitializer: any) => {
      const appRunner = await engineInitializer.initializeEngine({
        hostElement: target,
        assetBase: '/web/',
      });
      await appRunner.runApp();
      setTimeout(() => {
        loadEpisode(props.bundle);
      }, 1000);
    },
  });
};

onMounted(() => {
  flutterLoader();
});
</script>

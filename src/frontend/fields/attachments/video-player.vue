<template>
  <div class="flex w-full flex-col items-center justify-center bg-black py-8">
    <div
      v-if="source"
      class="relative w-full max-w-4xl"
      @mouseenter="showControls"
      @mouseleave="startHideTimer"
      @mousemove="showControls"
    >
      <video
        ref="videoElement"
        :src="source"
        :poster="posterUrl"
        class="w-full"
        @loadedmetadata="onLoadedMetadata"
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
        @play="onPlay"
        @pause="onPause"
        @click="togglePlay"
      ></video>

      <div
        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-end px-4 pb-6 transition-opacity duration-300"
        :class="{ 'opacity-0': !showControlsOverlay, 'opacity-100': showControlsOverlay }"
      >
        <div class="pointer-events-auto mb-4 flex items-center justify-center gap-6">
          <button
            class="text-white transition-colors hover:text-gray-300"
            aria-label="Previous"
            type="button"
            @click.prevent="previousTrack"
          >
            <Icon name="previous-control-button" />
          </button>

          <button
            class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-gray-200"
            aria-label="Play/Pause"
            type="button"
            @click.prevent="togglePlay"
          >
            <svg
              v-if="!isPlaying"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="6 4 18 12 6 20" />
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          </button>

          <button
            class="text-white transition-colors hover:text-gray-300"
            aria-label="Next"
            type="button"
            @click.prevent="nextTrack"
          >
            <Icon name="next-control-button" />
          </button>
        </div>

        <div class="pointer-events-auto flex w-full items-center gap-4">
          <span class="min-w-[3rem] text-right text-sm text-gray-400">{{
            formatTime(currentTime)
          }}</span>

          <div
            ref="progressBar"
            class="relative h-1.5 flex-1 cursor-pointer bg-white/30"
            @click.prevent="seekTo"
          >
            <div
              class="h-full bg-white transition-all"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>

          <span class="min-w-[3rem] text-sm text-gray-400">{{
            formatTime(duration)
          }}</span>
        </div>
      </div>
    </div>
    <div v-else class="p-4 text-gray-500">Video URL not available</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useSharedStore } from '../../store';
import { ResponseStatus } from '../../../types';
import Icon from '../../shared/icon.vue';
const shared = useSharedStore();

const props = defineProps<{
  // https://vz-831b1d74-446.b-cdn.net/d4748f79-100a-4446-862f-10f09a59d4aa/playlist.m3u8
  url: string;
  library: string;
}>();

const videoElement = ref<HTMLVideoElement | null>(null);
const progressBar = ref<HTMLDivElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const showControlsOverlay = ref(true);
let hideControlsTimer: ReturnType<typeof setTimeout> | null = null;

const source = computed(() => {
  if (props.url && props.url.startsWith('http')) {
    return props.url;
  }
  return '';
});

const posterUrl = computed(() => {
  if (!source.value) return '';
  if (source.value.includes('.m3u8')) {
    return source.value.replace('/playlist.m3u8', '/thumbnail.jpg');
  }
  return '';
});

const progressPercentage = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const showControls = () => {
  showControlsOverlay.value = true;
  if (isPlaying.value) {
    startHideTimer();
  }
};

const startHideTimer = () => {
  if (hideControlsTimer) {
    clearTimeout(hideControlsTimer);
  }

  if (isPlaying.value) {
    hideControlsTimer = setTimeout(() => {
      if (isPlaying.value) {
        showControlsOverlay.value = false;
      }
    }, 3000);
  }
};

const togglePlay = async () => {
  if (!videoElement.value) return;

  try {
    if (isPlaying.value) {
      videoElement.value.pause();
    } else {
      await videoElement.value.play();
    }
    showControls();
  } catch (error) {
    shared.addMessage(ResponseStatus.Failure, `Error toggling play: ${error}`);
  }
};

const onPlay = () => {
  isPlaying.value = true;
  startHideTimer();
};

const onPause = () => {
  isPlaying.value = false;

  if (hideControlsTimer) {
    clearTimeout(hideControlsTimer);
    hideControlsTimer = null;
  }

  showControlsOverlay.value = true;
};

const onLoadedMetadata = () => {
  if (videoElement.value) {
    duration.value = videoElement.value.duration;
  }
};

const onTimeUpdate = () => {
  if (videoElement.value) {
    currentTime.value = videoElement.value.currentTime;
  }
};

const onEnded = () => {
  isPlaying.value = false;

  if (hideControlsTimer) {
    clearTimeout(hideControlsTimer);
    hideControlsTimer = null;
  }

  showControlsOverlay.value = true;
};

const previousTrack = () => {
  if (videoElement.value) {
    videoElement.value.currentTime = Math.max(0, videoElement.value.currentTime - 10);
    showControls();
  }
};

const nextTrack = () => {
  if (videoElement.value) {
    videoElement.value.currentTime = Math.min(
      duration.value,
      videoElement.value.currentTime + 10,
    );
    showControls();
  }
};

const seekTo = (event: MouseEvent) => {
  if (!videoElement.value || !progressBar.value) return;

  const rect = progressBar.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const percentage = x / rect.width;
  const newTime = percentage * duration.value;

  videoElement.value.currentTime = newTime;
  currentTime.value = newTime;
  showControls();
};

onMounted(() => {
  if (!videoElement.value || !source.value) return;

  if (source.value.includes('.m3u8')) {
    import('hls.js')
      .then((HlsModule) => {
        const Hls = HlsModule.default;
        if (Hls.isSupported() && videoElement.value) {
          const hls = new Hls();
          hls.loadSource(source.value);
          hls.attachMedia(videoElement.value);

          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  shared.addMessage(
                    ResponseStatus.Failure,
                    'Fatal network error, trying to recover...',
                  );
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  shared.addMessage(
                    ResponseStatus.Failure,
                    'Fatal media error, trying to recover...',
                  );
                  hls.recoverMediaError();
                  break;
                default:
                  shared.addMessage(
                    ResponseStatus.Failure,
                    'Fatal error, cannot recover',
                  );
                  hls.destroy();
                  break;
              }
            }
          });
        } else if (
          videoElement.value &&
          videoElement.value.canPlayType('application/vnd.apple.mpegurl')
        ) {
          videoElement.value.src = source.value;
        }
      })
      .catch((error) => {
        shared.addMessage(ResponseStatus.Failure, `Failed to load hls.js: ${error}`);
        if (
          videoElement.value &&
          videoElement.value.canPlayType('application/vnd.apple.mpegurl')
        ) {
          videoElement.value.src = source.value;
        }
      });
  } else {
    if (videoElement.value) {
      videoElement.value.src = source.value;
    }
  }
});

onUnmounted(() => {
  if (hideControlsTimer) {
    clearTimeout(hideControlsTimer);
  }
});
</script>

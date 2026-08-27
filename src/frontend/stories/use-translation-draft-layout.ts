import { computed, nextTick, onMounted, onUnmounted, watch, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSharedStore } from '../store';

export function useTranslationDraftLayout(
  sourceSection: Ref<HTMLElement | null>,
  enabled = true,
) {
  const shared = useSharedStore();
  const { showSourceColumn } = storeToRefs(shared);

  const sourceLanguageName = computed(
    () => shared.config.languages?.[0]?.language ?? 'English',
  );

  const marginRight = computed(() => {
    if (shared.isLargeScreen && shared.hasOpenSidebar) {
      return (shared.layoutWidth - shared.headerWidth - 264) / 2 - 12;
    }
    if (shared.isLargeScreen && !shared.hasOpenSidebar) {
      return (shared.layoutWidth - shared.headerWidth - 84) / 2 - 12;
    }
    return 0;
  });

  let resizeObserver: ResizeObserver | null = null;

  const setDimensions = () => {
    if (sourceSection.value) {
      const sourceSectionRect = sourceSection.value.getBoundingClientRect();
      shared.setSourceSectionWidth(sourceSectionRect.width);
    }
  };

  watch(showSourceColumn, async (isVisible) => {
    if (!enabled) return;
    if (isVisible) {
      await nextTick();
      setDimensions();
    }
  });

  onMounted(async () => {
    if (!enabled) return;
    shared.setSingleColumn(true);
    shared.setShowMetaBox(false);
    if (shared.config.hasAppPreview) {
      shared.setShowAppPreview(false);
    }

    await nextTick();
    setDimensions();

    if (sourceSection.value) {
      resizeObserver = new ResizeObserver(() => {
        setDimensions();
      });
      resizeObserver.observe(sourceSection.value);
    }
    window.addEventListener('resize', setDimensions);
  });

  onUnmounted(() => {
    if (!enabled) return;
    shared.setSingleColumn(false);
    shared.setShowMetaBox(true);
    if (shared.config.hasAppPreview) {
      shared.setShowAppPreview(true);
    }

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    window.removeEventListener('resize', setDimensions);
  });

  return {
    shared,
    showSourceColumn,
    sourceLanguageName,
    marginRight,
    setDimensions,
  };
}

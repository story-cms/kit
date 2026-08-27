import { nextTick, onBeforeUnmount, onMounted, watch, type Ref } from 'vue';

type AlignmentElement = HTMLElement & {
  dataset: {
    blockFieldRow?: string;
    translationBlockIndex?: string;
    translationBlockSide?: string;
  };
};

export const useTranslationBlockFieldAlignment = (
  root: Ref<HTMLElement | null>,
  enabled: Ref<boolean>,
) => {
  let frame: number | null = null;
  let mutationObserver: MutationObserver | null = null;
  let resizeObserver: ResizeObserver | null = null;

  const rows = () =>
    Array.from(
      root.value?.querySelectorAll<AlignmentElement>('[data-block-field-row]') ?? [],
    );

  const clearAlignment = () => {
    rows().forEach((row) => {
      row.style.minHeight = '';
    });
  };

  const align = () => {
    frame = null;
    clearAlignment();
    if (!enabled.value || !root.value) return;

    const groups = new Map<string, AlignmentElement[]>();

    rows().forEach((row) => {
      const card = row.closest<AlignmentElement>('[data-translation-block-index]');
      const blockIndex = card?.dataset.translationBlockIndex;
      const side = card?.dataset.translationBlockSide;
      const field = row.dataset.blockFieldRow;
      if (!blockIndex || !side || !field) return;

      const key = `${blockIndex}:${field}`;
      groups.set(key, [...(groups.get(key) ?? []), row]);
    });

    groups.forEach((group) => {
      const sides = new Set(
        group.map(
          (row) =>
            row.closest<AlignmentElement>('[data-translation-block-side]')?.dataset
              .translationBlockSide,
        ),
      );
      if (sides.size < 2) return;

      const height = Math.max(
        ...group.map((row) => {
          const content = row.querySelector<HTMLElement>('[data-block-field-content]');
          return (
            content?.getBoundingClientRect().height ?? row.getBoundingClientRect().height
          );
        }),
      );
      group.forEach((row) => {
        row.style.minHeight = `${height}px`;
      });
    });
  };

  const scheduleAlignment = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(align);
  };

  const observeContent = () => {
    resizeObserver?.disconnect();
    root.value
      ?.querySelectorAll<HTMLElement>('[data-block-field-content]')
      .forEach((content) => resizeObserver?.observe(content));
    scheduleAlignment();
  };

  onMounted(() => {
    resizeObserver = new ResizeObserver(scheduleAlignment);
    mutationObserver = new MutationObserver(observeContent);
    if (root.value) {
      mutationObserver.observe(root.value, { childList: true, subtree: true });
    }
    observeContent();
  });

  watch(enabled, () => void nextTick(observeContent));

  onBeforeUnmount(() => {
    if (frame !== null) cancelAnimationFrame(frame);
    mutationObserver?.disconnect();
    resizeObserver?.disconnect();
    clearAlignment();
  });
};

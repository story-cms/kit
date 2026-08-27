export type StandardChapterTab = 'Details' | 'Blocks' | 'Resources';

const STANDARD_CHAPTER_TABS: StandardChapterTab[] = ['Details', 'Blocks', 'Resources'];

export function findStandardChapterTab(value: string | null): StandardChapterTab {
  if (!value) return 'Details';
  return (
    STANDARD_CHAPTER_TABS.find((tab) => tab.toLowerCase() === value.toLowerCase()) ??
    'Details'
  );
}

export function buildStandardChapterPayload(
  model: Record<string, unknown>,
  resources: Array<{ id: string }>,
) {
  return {
    feedback: '',
    bundle: {
      ...model,
      resources: resources.map(({ id }) => id),
    },
  };
}

export function withAttachedResource<T extends { id: string }>(
  attached: T[],
  available: T[],
  resourceId: string | null,
): T[] {
  if (!resourceId || attached.some(({ id }) => id === resourceId)) return attached;
  const resource = available.find(({ id }) => id === resourceId);
  return resource ? [...attached, resource] : attached;
}

interface AutosaveClock {
  setTimeout: (callback: () => void, delay: number) => unknown;
  clearTimeout: (timer: unknown) => void;
}

const browserClock: AutosaveClock = {
  setTimeout: (callback, delay) => window.setTimeout(callback, delay),
  clearTimeout: (timer) => window.clearTimeout(timer as number),
};

export function createAutosaveScheduler(
  save: () => void,
  clock: AutosaveClock = browserClock,
) {
  let timer: unknown = null;

  const cancel = () => {
    if (timer === null) return;
    clock.clearTimeout(timer);
    timer = null;
  };

  const schedule = () => {
    cancel();
    timer = clock.setTimeout(() => {
      timer = null;
      save();
    }, 2000);
  };

  return { schedule, cancel };
}

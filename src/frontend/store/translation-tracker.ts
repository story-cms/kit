import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import axios from 'axios';
import { useSharedStore } from './shared';

export type TranslationJobStatus = 'pending' | 'processing' | 'complete' | 'failed';

export interface TranslationJob {
  id: number;
  storyId: number;
  draftId: number;
  chapterNumber: number | null;
  locale: string;
  localeName: string;
  chapterTitle: string;
  status: TranslationJobStatus;
  canUndo: boolean;
  actualTokens: number | null;
}

export interface UndoneTranslation {
  jobId: number;
  draftId: number;
}

const POLL_INTERVAL_MS = 3000;
const AUTO_DISMISS_DELAY_MS = 60_000;

export const useTranslationTrackerStore = defineStore('translation-tracker', () => {
  const shared = useSharedStore();
  const jobs = ref<TranslationJob[]>([]);
  const lastUndone = ref<UndoneTranslation | null>(null);
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let subscriberCount = 0;
  const autoDismissTimers = new Map<number, ReturnType<typeof setTimeout>>();

  const clearAutoDismiss = (jobId: number) => {
    const timer = autoDismissTimers.get(jobId);
    if (timer === undefined) return;
    clearTimeout(timer);
    autoDismissTimers.delete(jobId);
  };

  const scheduleAutoDismiss = (job: TranslationJob) => {
    if (job.status !== 'complete' && job.status !== 'failed') return;
    if (autoDismissTimers.has(job.id)) return;

    autoDismissTimers.set(
      job.id,
      setTimeout(() => {
        autoDismissTimers.delete(job.id);
        dismiss(job.id);
      }, AUTO_DISMISS_DELAY_MS),
    );
  };

  const hasActiveJobs = computed(() =>
    jobs.value.some((job) => job.status === 'pending' || job.status === 'processing'),
  );

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`/${shared.locale}/translation-jobs`);
      jobs.value = response.data;
      jobs.value.forEach(scheduleAutoDismiss);
    } catch (error) {
      console.error('translation-tracker.fetchJobs', error);
    }
  };

  const addOptimisticJob = (job: TranslationJob) => {
    jobs.value = [job, ...jobs.value.filter((existing) => existing.id !== job.id)];
  };

  const dismiss = async (jobId: number) => {
    clearAutoDismiss(jobId);
    jobs.value = jobs.value.filter((job) => job.id !== jobId);
    try {
      await axios.delete(`/${shared.locale}/translation-jobs/${jobId}`);
    } catch (error) {
      console.error('translation-tracker.dismiss', error);
    }
  };

  const undo = async (jobId: number) => {
    clearAutoDismiss(jobId);
    const job = jobs.value.find((existing) => existing.id === jobId);
    jobs.value = jobs.value.filter((existing) => existing.id !== jobId);
    try {
      await axios.post(`/${shared.locale}/translation-jobs/${jobId}/undo`);
      if (job) lastUndone.value = { jobId, draftId: job.draftId };
    } catch (error) {
      console.error('translation-tracker.undo', error);
    }
  };

  // Multiple widget instances can mount across page navigations; only the
  // first subscriber starts polling, the last one to unmount stops it.
  const subscribe = () => {
    subscriberCount += 1;
    if (pollTimer !== null) return;

    fetchJobs();
    pollTimer = setInterval(fetchJobs, POLL_INTERVAL_MS);
  };

  const unsubscribe = () => {
    subscriberCount = Math.max(0, subscriberCount - 1);
    if (subscriberCount > 0 || pollTimer === null) return;

    clearInterval(pollTimer);
    pollTimer = null;
  };

  return {
    jobs,
    lastUndone,
    hasActiveJobs,
    fetchJobs,
    addOptimisticJob,
    dismiss,
    undo,
    subscribe,
    unsubscribe,
  };
});

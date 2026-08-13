import {
  BookMarked,
  BookOpen,
  Eye,
  FileText,
  HandHeart,
  Heart,
  Lightbulb,
  ShieldOff,
} from '@lucide/vue';

import type { RichListboxOption } from '../../../shared/rich-listbox.vue';

export type BlockRoleOption = RichListboxOption;

const fallbackBlockRoleOptions: BlockRoleOption[] = [
  {
    value: 'summary',
    label: 'Summary',
    description: 'Recap or overview of the session',
    icon: BookOpen,
  },
  {
    value: 'introduction',
    label: 'Introduction',
    description: 'Opening context for the content',
    icon: BookOpen,
  },
  {
    value: 'reflection',
    label: 'Reflection',
    description: 'Prompt for personal reflection',
    icon: BookOpen,
  },
];

const devotionBlockRoleOptions: BlockRoleOption[] = [
  {
    value: 'introduction',
    label: 'Introduction',
    description: 'Opens the devotion and sets the context',
    icon: BookOpen,
  },
  {
    value: 'scripture',
    label: 'Scripture',
    description: 'A Bible passage central to the devotion',
    icon: BookMarked,
  },
  {
    value: 'commentary',
    label: 'Commentary',
    description:
      'Explanation, interpretation, context, or theological reflection on the Scripture',
    icon: Lightbulb,
  },
  {
    value: 'reflection',
    label: 'Reflection',
    description: 'A moment for personal reflection',
    icon: Eye,
  },
  {
    value: 'prayer',
    label: 'Prayer',
    description: 'A guided or prompted prayer element',
    icon: Heart,
  },
  {
    value: 'response',
    label: 'Response',
    description: 'A call to act or respond to what was shared',
    icon: HandHeart,
  },
  {
    value: 'conclusion',
    label: 'Conclusion',
    description: 'Closes and summarises the devotion',
    icon: FileText,
  },
  {
    value: 'unclassified',
    label: 'Unclassified',
    description: 'For legacy content or where you are unsure of the role',
    icon: ShieldOff,
  },
];

const normalizeChapterType = (chapterType?: string | null): string =>
  chapterType?.trim().toLowerCase() ?? '';

export function isDevotionChapterType(chapterType?: string | null): boolean {
  return normalizeChapterType(chapterType) === 'devotion';
}

export function getBlockRoleOptions(chapterType?: string | null): BlockRoleOption[] {
  return isDevotionChapterType(chapterType)
    ? devotionBlockRoleOptions
    : fallbackBlockRoleOptions;
}

export function getDefaultBlockRole(chapterType?: string | null): string {
  return isDevotionChapterType(chapterType) ? 'introduction' : 'summary';
}

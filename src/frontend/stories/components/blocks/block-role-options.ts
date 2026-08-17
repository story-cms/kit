import {
  BookMarked,
  BookOpen,
  CircleCheck,
  CircleHelp,
  Eye,
  FileText,
  GraduationCap,
  HandHeart,
  Heart,
  Lightbulb,
  MessageCircle,
  RotateCcw,
  ShieldOff,
  Star,
  Users,
  Zap,
} from '@lucide/vue';

import type { RichListboxOption } from '../../../shared/rich-listbox.vue';
import { isCourseTemplate, isDevotionTemplate } from '../../../../shared/story_helpers';

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

const courseBlockRoleOptions: BlockRoleOption[] = [
  {
    value: 'introduction',
    label: 'Introduction',
    description: 'Opens the session and sets the context',
    icon: BookOpen,
  },
  {
    value: 'teaching',
    label: 'Teaching',
    description: 'Presents the main teaching or input',
    icon: GraduationCap,
  },
  {
    value: 'scripture',
    label: 'Scripture',
    description: 'A Bible passage central to the session',
    icon: BookMarked,
  },
  {
    value: 'explanation',
    label: 'Explanation',
    description: 'Clarifies an idea, passage, or concept',
    icon: CircleHelp,
  },
  {
    value: 'example',
    label: 'Example',
    description: 'Shares a story, testimony, or case study',
    icon: Star,
  },
  {
    value: 'question',
    label: 'Question',
    description: 'Prompts personal thought or response',
    icon: MessageCircle,
  },
  {
    value: 'discussion',
    label: 'Discussion',
    description: 'Guides conversation between participants',
    icon: Users,
  },
  {
    value: 'activity',
    label: 'Activity',
    description: 'Leads a task, exercise, or practice',
    icon: Zap,
  },
  {
    value: 'prayer',
    label: 'Prayer',
    description: 'Guides or prompts prayer',
    icon: Heart,
  },
  {
    value: 'response',
    label: 'Response',
    description: 'Invites a decision, commitment, or next step',
    icon: HandHeart,
  },
  {
    value: 'recap',
    label: 'Recap',
    description: 'Reviews or reinforces what has been covered',
    icon: RotateCcw,
  },
  {
    value: 'conclusion',
    label: 'Conclusion',
    description: 'Closes the session and points forward',
    icon: CircleCheck,
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

export function isCourseChapterType(chapterType?: string | null): boolean {
  return normalizeChapterType(chapterType) === 'session';
}

export function getBlockRoleOptions(
  chapterType?: string | null,
  template?: string | null,
): BlockRoleOption[] {
  if (isCourseTemplate(template) || isCourseChapterType(chapterType)) {
    return courseBlockRoleOptions;
  }

  if (isDevotionTemplate(template) || isDevotionChapterType(chapterType)) {
    return devotionBlockRoleOptions;
  }

  return fallbackBlockRoleOptions;
}

export function getDefaultBlockRole(
  chapterType?: string | null,
  template?: string | null,
): string {
  if (isCourseTemplate(template) || isCourseChapterType(chapterType)) {
    return 'introduction';
  }

  if (isDevotionTemplate(template) || isDevotionChapterType(chapterType)) {
    return 'introduction';
  }

  return 'summary';
}

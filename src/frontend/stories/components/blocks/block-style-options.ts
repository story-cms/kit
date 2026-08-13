import { Bookmark, Star, Tag } from '@lucide/vue';

import type { RichListboxOption } from '../../../shared/rich-listbox.vue';

export const blockStyleOptions: RichListboxOption[] = [
  {
    value: 'primary',
    label: 'Primary',
    description: 'Main featured content for this block',
    icon: Star,
  },
  {
    value: 'secondary',
    label: 'Secondary',
    description: 'Supporting content that complements the primary',
    icon: Bookmark,
  },
  {
    value: 'tertiary',
    label: 'Tertiary',
    description: 'Supplementary or additional content',
    icon: Tag,
  },
];

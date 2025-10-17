import type EasyMDE from 'easymde';
import { parseReference } from '../../shared/helpers';

export interface EditorButton {
  name: string;
  className?: string;
  title?: string;
  // eslint-disable-next-line no-unused-vars
  action?: (instance: EasyMDE) => void;
}

export const customToolbarButtons: EditorButton[] = [
  {
    name: 'superscript',
    className: 'fa fa-superscript',
    title: 'Verse number',
    action: (instance: EasyMDE) => {
      const selection = instance.codemirror.getSelection();
      const newValue = `\`${selection}\``;
      return instance.codemirror.replaceSelection(newValue);
    },
  },

  {
    name: 'scripture-reference',
    className: 'fa fa-book',
    title: 'Insert Scripture Reference',
    action: (instance: EasyMDE) => {
      const selection = instance.codemirror.getSelection().trim();
      let parsedRef = parseReference(selection);
      if (parsedRef !== '') {
        const scriptureLink = `[${selection}](journeys://${parsedRef})`;
        instance.codemirror.replaceSelection(scriptureLink);
        return;
      }

      const reference = prompt('Enter scripture reference (e.g., John 10:10):');
      if (reference === null || reference.trim() === '') return;

      parsedRef = parseReference(reference);
      if (!parsedRef) {
        parsedRef = 'LUK.4.46';
      }

      const anchor = selection !== '' ? selection : reference;
      const scriptureLink = `[${anchor}](journeys://${parsedRef})`;
      instance.codemirror.replaceSelection(scriptureLink);
    },
  },

  {
    name: 'transparent',
    className: 'fa fa-transparent pointer-events-none',
    title: '',
    action: () => {
      return null;
    },
  },
];

export const defaultButtons: string[] = [
  'bold',
  'italic',
  'unordered-list',
  'ordered-list',
  '|',
  'guide',
];

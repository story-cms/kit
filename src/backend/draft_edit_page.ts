import { isChapterDraftTemplate } from '../shared/chapter_draft.js';

export type DraftEditPage =
  | 'DraftIndex'
  | 'TranslationIndex'
  | 'ChapterDraftEdit';

export const draftEditPage = (
  template: string | null | undefined,
  isTranslation: boolean,
): DraftEditPage => {
  if (isChapterDraftTemplate(template)) {
    return 'ChapterDraftEdit';
  }

  return isTranslation ? 'TranslationIndex' : 'DraftIndex';
};

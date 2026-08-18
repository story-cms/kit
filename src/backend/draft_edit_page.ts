import { isCourseTemplate, isDevotionTemplate } from '../shared/story_helpers.js';

export type DraftEditPage =
  | 'DraftIndex'
  | 'TranslationIndex'
  | 'DevotionDraftEdit'
  | 'DevotionDraftTranslationEdit'
  | 'CourseDraftEdit'
  | 'CourseDraftTranslationEdit';

export const draftEditPage = (
  template: string | null | undefined,
  isTranslation: boolean,
): DraftEditPage => {
  if (isDevotionTemplate(template)) {
    return isTranslation ? 'DevotionDraftTranslationEdit' : 'DevotionDraftEdit';
  }

  if (isCourseTemplate(template)) {
    return isTranslation ? 'CourseDraftTranslationEdit' : 'CourseDraftEdit';
  }

  return isTranslation ? 'TranslationIndex' : 'DraftIndex';
};

import type { Resource, ResourceBundle, ResourceType, VisibilityType } from '../../types.js';

export type ResourceRow = {
  id: string;
  title: string;
  type: string;
  imageUrl: string | null;
  label: string | null;
  visibility: string;
  description: string | null;
  isPublished: boolean;
  bundle: unknown;
};

export const extractResourceUrl = (
  type: string,
  bundle: ResourceBundle,
): string | undefined => {
  switch (type) {
    case 'video':
      return 'video' in bundle ? bundle.video.url : undefined;
    case 'info_link':
      return 'infoUrl' in bundle ? bundle.infoUrl : undefined;
    default:
      return undefined;
  }
};

export const toResourceDto = (model: ResourceRow): Resource => {
  const bundle = model.bundle as ResourceBundle;

  return {
    id: model.id,
    title: model.title,
    type: model.type as ResourceType,
    imageUrl: model.imageUrl,
    url: extractResourceUrl(model.type, bundle),
    label: model.label,
    visibility: model.visibility as VisibilityType,
    description: model.description,
    isPublished: model.isPublished,
  };
};

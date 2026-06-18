import { DateTime } from 'luxon';
import type {
  Resource,
  ResourceBundle,
  ResourceIndexItem,
  ResourceType,
  VisibilityType,
} from '../../types.js';

export type ResourceRow = {
  id: string;
  title: string;
  type: string;
  imageUrl: string | null;
  label: string | null;
  visibility: string;
  description: string | null;
  bundle: unknown;
  createdAt?: DateTime | string;
  updatedAt?: DateTime | string;
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

const formatResourceDate = (value: DateTime | string | undefined): string => {
  if (!value) return '';
  if (typeof value === 'string') return value.split('T')[0];
  return value.toISODate() ?? value.toISO()?.split('T')[0] ?? '';
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
  };
};

export const toResourceIndexItem = (model: ResourceRow): ResourceIndexItem => {
  return {
    ...toResourceDto(model),
    createdAt: formatResourceDate(model.createdAt),
    updatedAt: formatResourceDate(model.updatedAt),
  };
};

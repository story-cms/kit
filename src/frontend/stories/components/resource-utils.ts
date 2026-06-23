import type { ResourceItem, ResourceType } from '../../../types';

export const resourceTypeColor = (type: ResourceType): string => {
  switch (type) {
    case 'video':
      return 'bg-violet-100 text-violet-700';
    case 'text':
      return 'bg-blue-100 text-blue-700';
    case 'info_link':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const resourceTypeLabel = (type: ResourceType): string => {
  switch (type) {
    case 'video':
      return 'Video';
    case 'text':
      return 'Text';
    case 'info_link':
      return 'Info Link';
    default:
      return type;
  }
};

export const groupResourcesByLabel = (
  resources: ResourceItem[],
): Record<string, ResourceItem[]> => {
  const groups: Record<string, ResourceItem[]> = {};

  for (const resource of resources) {
    const label = resource.label || 'Uncategorized';
    if (!groups[label]) groups[label] = [];
    groups[label].push(resource);
  }

  return groups;
};

export const orderedLabels = (resources: ResourceItem[]): string[] => {
  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const resource of resources) {
    const label = resource.label || 'Uncategorized';
    if (!seen.has(label)) {
      seen.add(label);
      ordered.push(label);
    }
  }

  return ordered;
};

export const resourceIds = (resources: ResourceItem[]): string[] =>
  resources.map((r) => r.id);

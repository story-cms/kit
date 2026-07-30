import type { ResourceItem, ResourceType, VisibilityType } from '../../../types';

export const visibilityBadgeClasses = (visibility: VisibilityType): string => {
  switch (visibility) {
    case 'public':
      return 'bg-studio-yellow text-studio-forest';
    case 'leaders':
      return 'bg-studio-lime text-studio-forest';
    case 'guests':
      return 'bg-studio-green text-studio-forest';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const resourceTypeLabel = (type: ResourceType): string => {
  switch (type) {
    case 'video':
      return 'Video';
    case 'text':
      return 'Article';
    case 'url':
      return 'URL';
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

export const compareResourcesByRecentlyEdited = (
  a: { updatedAt: string; title: string },
  b: { updatedAt: string; title: string },
): number => {
  const byDate = b.updatedAt.localeCompare(a.updatedAt);
  if (byDate !== 0) return byDate;
  return a.title.localeCompare(b.title);
};

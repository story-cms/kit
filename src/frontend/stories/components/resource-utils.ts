import type { Resource, ResourceFormat } from '../../../types';

export const resourceTypeColor = (type: ResourceFormat): string => {
  switch (type) {
    case 'video':
      return 'bg-violet-100 text-violet-700';
    case 'article':
      return 'bg-blue-100 text-blue-700';
    case 'pdf':
      return 'bg-green-100 text-green-700';
    case 'url':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const groupResourcesByLabel = (resources: Resource[]): Record<string, Resource[]> => {
  const groups: Record<string, Resource[]> = {};

  for (const resource of resources) {
    const label = resource.label || 'Uncategorized';
    if (!groups[label]) groups[label] = [];
    groups[label].push(resource);
  }

  return groups;
};

export const orderedLabels = (resources: Resource[]): string[] => {
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

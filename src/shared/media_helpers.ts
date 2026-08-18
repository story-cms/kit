import type {
  CmsConfig,
  FieldSpec,
  MediaCollectionMap,
  MediaKind,
  MediaUploadConfig,
} from '../types.js';
import {
  audioUploadConfig,
  imageUploadConfig,
  videoUploadConfig,
} from './media_upload_configs.js';

const uploadConfigForKind = (kind: MediaKind): MediaUploadConfig => {
  switch (kind) {
    case 'video':
      return videoUploadConfig;
    case 'image':
      return imageUploadConfig;
    case 'audio':
      return audioUploadConfig;
  }
};

const defaultLabelForKind = (kind: MediaKind): string => {
  switch (kind) {
    case 'video':
      return 'Video';
    case 'image':
      return 'Cover Image';
    case 'audio':
      return 'Audio';
  }
};

const defaultNameForKind = (kind: MediaKind): string => {
  switch (kind) {
    case 'video':
      return 'video';
    case 'image':
      return 'coverImage';
    case 'audio':
      return 'audio';
  }
};

export function buildMediaFieldSpec(
  kind: MediaKind,
  collectionId: string,
  overrides?: Partial<Pick<FieldSpec, 'label' | 'name'>>,
): FieldSpec {
  const uploadConfig = uploadConfigForKind(kind);
  const base: FieldSpec = {
    name: overrides?.name ?? defaultNameForKind(kind),
    label: overrides?.label ?? defaultLabelForKind(kind),
    widget: kind,
    description: uploadConfig.description,
    extensions: uploadConfig.extensions,
    maxSize: uploadConfig.maxSize,
  };

  switch (kind) {
    case 'video':
      return { ...base, collectionId };
    case 'image':
      return { ...base, uploadPreset: collectionId };
    case 'audio':
      return { ...base, folder: collectionId };
  }
}

export function globalMediaCollections(config: CmsConfig): MediaCollectionMap {
  return {
    video: config.videoCollectionId,
    image: config.imageCollectionId,
    audio: config.audioCollectionId,
  };
}

export function mediaCollectionsForTemplate(
  config: CmsConfig,
  templateId: string,
): MediaCollectionMap {
  const template = config.storyTemplates.find((entry) => entry.id === templateId);
  return template?.collections ?? {};
}

export function assertTemplateCollectionsMatchGlobals(config: CmsConfig): void {
  const globals = globalMediaCollections(config);

  for (const template of config.storyTemplates) {
    if (!template.collections) continue;

    for (const kind of ['video', 'image', 'audio'] as MediaKind[]) {
      const templateValue = template.collections[kind];
      if (templateValue === undefined) continue;

      const globalValue = globals[kind] ?? '';
      if (templateValue !== globalValue) {
        throw new Error(
          `Template "${template.id}" collections.${kind} does not match global ${kind}CollectionId`,
        );
      }
    }
  }
}

import ResourceModel from '../models/resource.js';
import StoryLocalisation from '../models/story_localisation.js';
import { toResourceDto, toResourceIndexItem } from './resource_mapper.js';
import type {
  LinkBundle,
  Resource,
  ResourceBundle,
  ResourceIndexItem,
  ResourceType,
  TextBundle,
  VideoBundle,
  VisibilityType,
} from '../../types.js';

export { extractResourceUrl, toResourceDto, toResourceIndexItem } from './resource_mapper.js';

export interface ResourcePayload {
  title: string;
  type: ResourceType;
  imageUrl?: string | null;
  description?: string | null;
  label?: string | null;
  visibility: VisibilityType;
  content?: string;
  infoUrl?: string;
  video?: { url: string | null };
}

const buildBundle = (payload: ResourcePayload): ResourceBundle => {
  switch (payload.type) {
    case 'text':
      return { content: payload.content ?? '' } satisfies TextBundle;
    case 'video':
      return { video: { url: payload.video?.url ?? '' } } satisfies VideoBundle;
    case 'info_link':
      return { infoUrl: payload.infoUrl ?? '' } satisfies LinkBundle;
  }
};

const bundleToModel = (model: ResourceModel): Record<string, unknown> => {
  const bundle = model.bundle as ResourceBundle;
  const base = {
    title: model.title,
    type: model.type,
    imageUrl: model.imageUrl ?? '',
    description: model.description ?? '',
    label: model.label ?? '',
    visibility: model.visibility,
  };

  switch (model.type) {
    case 'text':
      return { ...base, content: 'content' in bundle ? bundle.content : '' };
    case 'video':
      return {
        ...base,
        video: 'video' in bundle ? bundle.video : { url: null },
      };
    case 'info_link':
      return { ...base, infoUrl: 'infoUrl' in bundle ? bundle.infoUrl : '' };
    default:
      return base;
  }
};

export class ResourceService {
  public toDto(model: ResourceModel): Resource {
    return toResourceDto(model);
  }

  public toIndexItem(model: ResourceModel): ResourceIndexItem {
    return toResourceIndexItem(model);
  }

  public modelToBundle(model: ResourceModel): Record<string, unknown> {
    return bundleToModel(model);
  }

  public async listByLocale(locale: string): Promise<Resource[]> {
    const models = await ResourceModel.query().where('locale', locale).orderBy('title', 'asc');
    return models.map((model) => this.toDto(model));
  }

  public async listIndexItems(locale: string): Promise<ResourceIndexItem[]> {
    const models = await ResourceModel.query().where('locale', locale).orderBy('title', 'asc');
    return models.map((model) => this.toIndexItem(model));
  }

  public async findOrFail(id: string): Promise<ResourceModel> {
    return ResourceModel.findOrFail(id);
  }

  public async hydrate(ids: string[]): Promise<Resource[]> {
    if (ids.length === 0) return [];

    const models = await ResourceModel.query().whereIn('id', ids);
    const byId = new Map(models.map((model) => [model.id, model]));

    return ids.flatMap((id) => {
      const model = byId.get(id);
      return model ? [this.toDto(model)] : [];
    });
  }

  public async create(
    locale: string,
    payload: ResourcePayload,
    userId?: number,
  ): Promise<ResourceModel> {
    return ResourceModel.create({
      locale,
      title: payload.title,
      type: payload.type,
      imageUrl: payload.imageUrl ?? null,
      description: payload.description ?? null,
      label: payload.label ?? null,
      visibility: payload.visibility,
      bundle: buildBundle(payload),
      updatedBy: userId ?? null,
    });
  }

  public async update(
    id: string,
    payload: ResourcePayload,
    userId?: number,
  ): Promise<ResourceModel> {
    const model = await this.findOrFail(id);

    model.title = payload.title;
    model.type = payload.type;
    model.imageUrl = payload.imageUrl ?? null;
    model.description = payload.description ?? null;
    model.label = payload.label ?? null;
    model.visibility = payload.visibility;
    model.bundle = buildBundle(payload);
    model.updatedBy = userId ?? null;

    await model.save();
    return model;
  }

  public async delete(id: string): Promise<void> {
    const model = await this.findOrFail(id);
    await model.delete();
  }

  public async updateStoryResources(
    storyId: number,
    locale: string,
    resourceIds: string[],
  ): Promise<void> {
    const localisation = await StoryLocalisation.query()
      .where('storyId', storyId)
      .where('locale', locale)
      .first();

    if (!localisation) return;

    localisation.resources = resourceIds;
    await localisation.save();
  }
}

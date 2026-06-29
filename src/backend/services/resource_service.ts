import db from '@adonisjs/lucid/services/db';
import Resource from '../models/resource.js';
import StoryLocalisation from '../models/story_localisation.js';
import type {
  LinkBundle,
  ResourceItem,
  ResourceBundle,
  ResourceIndexItem,
  ResourcePayload,
  ResourceStoryUsage,
  TextBundle,
  VideoBundle,
} from '../../types.js';
import { toResourceIndexItem, toResourceItem } from './resource_mapper.js';

const buildBundle = (payload: ResourcePayload): ResourceBundle => {
  switch (payload.type) {
    case 'text':
      return { content: payload.content ?? '' } satisfies TextBundle;
    case 'video':
      return { video: { url: payload.video?.url ?? '' } } satisfies VideoBundle;
    case 'url':
      return { url: payload.url ?? '' } satisfies LinkBundle;
  }
};

export class ResourceService {
  public toResourceItem(model: Resource): ResourceItem {
    return toResourceItem(model);
  }

  public toIndexItem(model: Resource): ResourceIndexItem {
    return toResourceIndexItem(model);
  }

  public modelToBundle(model: Resource): Record<string, unknown> {
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
      case 'url':
        return { ...base, url: 'url' in bundle ? bundle.url : '' };
      default:
        return base;
    }
  }

  public async listForLocale(locale: string): Promise<ResourceItem[]> {
    const models = await Resource.query().where('locale', locale).orderBy('title', 'asc');
    return models.map((model) => this.toResourceItem(model));
  }

  public async listIndexItems(locale: string): Promise<ResourceIndexItem[]> {
    const models = await Resource.query().where('locale', locale).orderBy('title', 'asc');
    return models.map((model) => this.toIndexItem(model));
  }

  public async hydrate(ids: string[]): Promise<ResourceItem[]> {
    if (ids.length === 0) return [];

    const models = await Resource.query().whereIn('id', ids);
    const byId = new Map(models.map((model) => [model.id, model]));

    return ids.flatMap((id) => {
      const model = byId.get(id);
      return model ? [this.toResourceItem(model)] : [];
    });
  }

  public async create(
    locale: string,
    payload: ResourcePayload,
    userId?: number,
  ): Promise<Resource> {
    return Resource.create({
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
  ): Promise<Resource> {
    const model = await Resource.findOrFail(id);

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
    const model = await Resource.findOrFail(id);

    await db.transaction(async (trx) => {
      const localisations = await StoryLocalisation.query({ client: trx }).whereRaw(
        'resources @> ?::jsonb',
        [JSON.stringify([id])],
      );

      for (const localisation of localisations) {
        localisation.resources = localisation.resources.filter(
          (resourceId) => resourceId !== id,
        );
        localisation.useTransaction(trx);
        await localisation.save();
      }

      model.useTransaction(trx);
      await model.delete();
    });
  }

  public async listStoryUsages(
    resourceId: string,
    locale: string,
  ): Promise<ResourceStoryUsage[]> {
    const localisations = await StoryLocalisation.query()
      .where('locale', locale)
      .whereRaw('resources @> ?::jsonb', [JSON.stringify([resourceId])])
      .orderBy('title', 'asc');

    return localisations.map((localisation) => ({
      storyId: localisation.storyId,
      title: localisation.title,
    }));
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

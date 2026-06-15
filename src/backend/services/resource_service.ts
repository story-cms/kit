import ResourceModel from '../models/resource.js';
import StoryLocalisation from '../models/story_localisation.js';
import { toResourceDto } from './resource_mapper.js';
import type { Resource } from '../../types.js';

export { extractResourceUrl, toResourceDto } from './resource_mapper.js';

export class ResourceService {
  public toDto(model: ResourceModel): Resource {
    return toResourceDto(model);
  }

  public async listByLocale(locale: string): Promise<Resource[]> {
    const models = await ResourceModel.query().where('locale', locale).orderBy('title', 'asc');
    return models.map((model) => this.toDto(model));
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

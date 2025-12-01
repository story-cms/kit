import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import { DateTime } from 'luxon';
import type { StreamSpec } from '../../types';
import Drop from '../models/page.js';
import { CmsService } from './cms_service.js';

export class StreamService {
  public stream: StreamSpec;
  constructor(
    streamId: number,
    protected cms: CmsService,
  ) {
    const needle = Number(streamId);
    this.stream =
      this.cms.config.streams.streams.find((s: StreamSpec) => s.id === needle) ??
      ({
        id: 0,
        title: '',
        coverImage: '',
        streamType: '',
        dropType: '',
        schemaVersion: 0,
        fields: [],
      } as StreamSpec);
  }

  get metaData(): StreamMeta {
    return {
      id: this.stream.id,
      title: this.stream.title,
      coverImage: this.stream.coverImage,
    };
  }

  public async getDrops(
    requestPage: number | undefined,
  ): Promise<ModelPaginatorContract<Drop>> {
    const page = requestPage || 1;
    const perPage = requestPage ? 20 : 365;
    const cutoffDate = DateTime.now().plus({ days: 1 }).toSQL();

    const drops = await Drop.query()
      .where('streamId', this.stream.id)
      .where('isPublished', true)
      .whereNotNull('releaseAt')
      .where('releaseAt', '<=', cutoffDate)
      .orderBy('releaseAt', 'desc')
      .paginate(page, perPage);

    return drops;
  }
}

export type StreamMeta = {
  id: number;
  title: string;
  coverImage: string;
};

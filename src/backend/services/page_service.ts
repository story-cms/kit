import type { Version, PageBundle, PageItem } from '../../types';
import Page from '../models/page.js';
import { CmsService } from './cms_service.js';

export class PageService {
  protected version: Version;

  constructor(
    version: Version,
    protected cms: CmsService,
  ) {
    this.version = version;
  }

  public async getCreateDefaults(): Promise<{ order: number; group: number }> {
    const lastPage = await Page.query()
      .where(this.version)
      .orderBy('order', 'desc')
      .orderBy('id', 'desc')
      .first();

    if (!lastPage) {
      return { order: 1, group: 1 };
    }

    return {
      order: lastPage.order + 1,
      group: lastPage.bundle.group ?? 1,
    };
  }

  public async getPageItems(): Promise<PageItem[]> {
    const pages = await Page.query().where(this.version).orderBy('order', 'asc');
    const maxId = pages.reduce((max, page) => Math.max(max, page.id), 0);

    const collected: PageItem[] = [];
    let group = 1;
    pages.forEach((page: Page) => {
      if (page.isPublished && page.bundle.group !== group) {
        group = page.bundle.group;
        collected.push({
          id: maxId + group,
          isDivider: true,
          isPublished: true,
        });
      }
      collected.push(page.model);
    });

    return collected;
  }

  public async getPageItemsForClient(): Promise<PageBundle[]> {
    const pages = await Page.query()
      .where(this.version)
      .where('isPublished', true)
      .orderBy('order', 'asc');

    const tracking = this.cms.config.pagesTracking;
    return pages.map((page) => page.bundleWithTracking(tracking));
  }

  public async pagesFromItems(items: PageItem[]): Promise<Page[]> {
    const pages = await Page.query().where(this.version);

    const collected: Page[] = [];
    let group = 1;
    let order = 0; // can't be i

    for (const item of items) {
      if (item.isDivider) {
        group++;
        continue;
      }

      const page = pages.find((p) => p.id === item.id);

      if (!page) {
        continue;
      }

      page.order = order;
      page.updateBundle({ group: group });
      collected.push(page);
      order++;
    }

    return collected;
  }
}

import type { PageVersion, PageBundle, PageItem } from '../../types';
import Page from '../models/page.js';
import cms from './cms.js';

export default class PageService {
  protected version: PageVersion;

  constructor(version: PageVersion) {
    this.version = version;
  }

  public async getPageItems(): Promise<PageItem[]> {
    const pages = await Page.query().where(this.version).orderBy('order', 'asc');
    const maxId = pages.reduce((max, page) => Math.max(max, page.id), 0);

    const collected: PageItem[] = [];
    let group = 1;
    pages.forEach((page: Page) => {
      const bundle = page.parsedBundle;
      if (page.isPublished && bundle.group !== group) {
        group = bundle.group;
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

    const tracking = cms.config.pages.tracking;
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

import Index from '../models/index.js';
import Chapter from '../models/chapter.js';
import Draft from '../models/draft.js';
import cms from './cms.js';
import { IndexItem, GroupedIndexItem } from '../../types.js';

export default class IndexService {
  public story: any;
  public config: object = {};

  constructor(story: any) {
    this.story = story;
  }

  public async buildIndex(version: any) {
    const index = await Index.firstOrCreate(version, {
      items: { root: [] },
    });

    const drafts = await Draft.query().where(version);
    const published = await Chapter.query().where(version);

    // assemble the items
    const items: { root: IndexItem[] } = { root: [] };
    published.forEach((chapter: Chapter) => items.root.push(chapter.index));
    drafts.forEach((draft: Draft) => {
      if (items.root.some((item) => item.number === draft.number)) return;
      items.root.push(draft.index);
    });

    index.items = items;
    index.sortItems();

    // build the tag lists
    const issues = await Draft.query().where(version).andWhereNotNull('feedback');
    index.draftsList = drafts.map((draft) => draft.number);
    index.publishedList = published.map((chapter) => chapter.number);
    index.issuesList = issues.map((draft) => draft.number);

    await index.save();
  }

  public async getItems(version: any): Promise<any[]> {
    const index = await Index.query().where(version).first();
    if (!index) return [];

    return index!.list.map((item) => {
      const tags: string[] = [];
      if (index.publishedList.some((i) => i === item.number)) tags.push('Live');
      if (index.draftsList.some((i) => i === item.number)) tags.push('Draft');
      if (index.issuesList.some((i) => i === item.number)) tags.push('Issues');
      return {
        ...item,
        tags,
      };
    });
  }

  public async groupedIndex(version: any): Promise<IndexItem[] | GroupedIndexItem[]> {
    const index = await Index.query().where(version).firstOrFail();

    if (!index) return [];

    if (!this.storyHasParts) {
      return index.publicList;
    }

    const grouped = (this.story.parts as any[]).map(
      (part: any) =>
        ({
          id: part.id,
          title: part.title,
          subtitle: part.subtitle,
          description: part.description,
          index: [],
        }) as GroupedIndexItem,
    );

    index!.publicList.forEach((item) => {
      const part = grouped.find((group) => group.id === item.part);
      if (part)
        part.index.push({
          id: item.number,
          title: item.title,
          imageUrl: item.imageUrl,
        });
    });

    return grouped;
  }

  public get storyHasParts(): boolean {
    return !!this.story.parts;
  }

  public async getCurrentApiVersion(): Promise<number> {
    const rows = await Chapter.query().max('api_version');
    return rows[0].$extras.max || 1;
  }

  public async getAddStatus(version: any): Promise<any> {
    const index = await this.getItems(version);

    if (index.length >= this.story.chapterLimit) return 'Full';

    // We have not reached the limit for the number of chapters and we're not a translation
    if (version.locale === cms.config.languages.languages[0].locale) {
      return 'Add';
    }

    const number = index.length + 1;

    const specifier = {
      apiVersion: version.apiVersion,
      locale: cms.config.languages.languages[0].locale,
      storyId: this.story.id,
      number: number,
    };

    const source = await Chapter.query().where(specifier).first();

    if (!source) return 'Wait';
    return 'Add';
  }

  public async getNewChapterNumber(version: any): Promise<number> {
    await this.buildIndex(version);

    const index = await Index.query().where(version).first();
    if (!index) return 1;

    let next = 1;
    while (index.list.some((item) => item.number === next)) {
      next += 1;
    }
    if (next < index.list.length + 1) return next;

    return index.list.length + 1;
  }
}

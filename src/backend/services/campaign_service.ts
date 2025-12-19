import { type CampaignItem, type CampaignVersion } from '../../types';
import Campaign from '../models/campaign.js';
import { CmsService } from './cms_service.js';
import { DateTime } from 'luxon';

type CampaignItemWithWindow = CampaignItem & { window?: string };

export class CampaignService {
  protected version: CampaignVersion;

  constructor(
    version: CampaignVersion,
    protected cms: CmsService,
  ) {
    this.version = version;
  }

  private getWindowStart(item: CampaignItemWithWindow): DateTime | null {
    if (!item.window) return null;
    const [startStr] = item.window.split('|');
    return DateTime.fromISO(startStr);
  }

  public async getCampaignItems(): Promise<CampaignItem[]> {
    const campaigns = await Campaign.query()
      .where(this.version)
      .orderBy('created_at', 'desc');
    return campaigns.map((campaign) => campaign.model);
  }

  public async getCampaignItemsForClient(): Promise<CampaignItem[]> {
    const campaigns = await Campaign.query()
      .where(this.version)
      .where('isPublished', true)
      .orderBy('created_at', 'desc');

    const items = campaigns.map((campaign) => campaign.model);

    const now = DateTime.now();

    const categorized = items.reduce(
      (acc, item) => {
        const itemWithWindow = item as CampaignItemWithWindow;
        if (!itemWithWindow.window) {
          acc.noWindow.push(item);
          return acc;
        }

        const [startStr, endStr] = itemWithWindow.window.split('|');
        const windowStart = DateTime.fromISO(startStr);
        const windowEnd = DateTime.fromISO(endStr);

        if (now >= windowStart && now <= windowEnd) {
          acc.current.push(item);
        } else if (windowStart > now) {
          acc.upcoming.push(item);
        } else {
          acc.past.push(item);
        }

        return acc;
      },
      {
        current: [] as CampaignItem[],
        upcoming: [] as CampaignItem[],
        past: [] as CampaignItem[],
        noWindow: [] as CampaignItem[],
      },
    );

    categorized.current.sort((a, b) => {
      const aStart = this.getWindowStart(a as CampaignItemWithWindow);
      const bStart = this.getWindowStart(b as CampaignItemWithWindow);
      if (!aStart || !bStart) return 0;
      return aStart.toMillis() - bStart.toMillis();
    });

    categorized.upcoming.sort((a, b) => {
      const aStart = this.getWindowStart(a as CampaignItemWithWindow);
      const bStart = this.getWindowStart(b as CampaignItemWithWindow);
      if (!aStart || !bStart) return 0;
      return aStart.toMillis() - bStart.toMillis();
    });

    categorized.past.sort((a, b) => {
      const aStart = this.getWindowStart(a as CampaignItemWithWindow);
      const bStart = this.getWindowStart(b as CampaignItemWithWindow);
      if (!aStart || !bStart) return 0;
      return bStart.toMillis() - aStart.toMillis();
    });

    return [
      ...categorized.current,
      ...categorized.upcoming,
      ...categorized.past,
      ...categorized.noWindow,
    ];
  }
}

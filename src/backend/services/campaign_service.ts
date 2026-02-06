import { DateTime } from 'luxon';

import {
  type CampaignItem,
  type CampaignForApi,
  type CampaignVersion,
} from '../../types';
import Campaign from '../models/campaign.js';

export class CampaignService {
  constructor(private version: CampaignVersion) {}

  public async getCampaignItems(): Promise<CampaignItem[]> {
    const campaigns = await this.getCampaignsForVersion();
    return campaigns
      .map((campaign) => {
        const startDate = campaign.splitWindow[0]?.toISO() ?? null;
        return {
          id: campaign.id,
          name: campaign.bundle.name,
          regions: campaign.bundle.regions,
          window: campaign.bundle.window,
          isPublished: campaign.isPublished,
          startDate,
        };
      })
      .sort((a, b) => {
        // Sort by startDate descending, nulls at the end
        if (a.startDate === null && b.startDate === null) return 0;
        if (a.startDate === null) return 1;
        if (b.startDate === null) return -1;
        return b.startDate.localeCompare(a.startDate);
      });
  }

  public async getCampaignItemsForClient(): Promise<CampaignForApi[]> {
    const campaigns = await this.getCampaignsForVersion();
    return campaigns
      .filter((campaign) => {
        if (!campaign.isPublished) return false;
        const [start, end] = campaign.splitWindow;
        if (!start || !end) return false;

        if (end < DateTime.now()) return false;

        return true;
      })
      .map((campaign) => campaign.forApi)
      .sort((a, b) => {
        // Sort by startDate ascending, nulls at the end
        if (a.startDate === null && b.startDate === null) return 0;
        if (a.startDate === null) return 1;
        if (b.startDate === null) return -1;
        return a.startDate.localeCompare(b.startDate);
      });
  }

  async getCampaignsForVersion(): Promise<Campaign[]> {
    const campaigns = await Campaign.query().where(this.version);
    return campaigns;
  }
}

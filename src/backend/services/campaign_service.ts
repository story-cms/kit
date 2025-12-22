import { type CampaignForApi, type CampaignVersion } from '../../types';
import Campaign from '../models/campaign.js';
import { DateTime } from 'luxon';

export class CampaignService {
  constructor(private version: CampaignVersion) {}

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

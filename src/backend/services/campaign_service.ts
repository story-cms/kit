import { type CampaignForApi, type CampaignVersion } from '../../types';
import Campaign from '../models/campaign.js';
import { CmsService } from './cms_service.js';
import { DateTime } from 'luxon';

export class CampaignService {
  protected version: CampaignVersion;

  constructor(
    version: CampaignVersion,
    protected cms: CmsService,
  ) {
    this.version = version;
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
      .map((campaign) => campaign.forApi);
  }

  async getCampaignsForVersion(): Promise<Campaign[]> {
    const campaigns = await Campaign.query().where(this.version);
    return campaigns;
  }
}

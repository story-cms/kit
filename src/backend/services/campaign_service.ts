import { type CampaignItem, type CampaignVersion } from '../../types';
import Campaign from '../models/campaign.js';
import { CmsService } from './cms_service.js';
import { categorizeAndSortCampaigns } from './helpers.js';

export class CampaignService {
  protected version: CampaignVersion;

  constructor(
    version: CampaignVersion,
    protected cms: CmsService,
  ) {
    this.version = version;
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

    return categorizeAndSortCampaigns(items);
  }
}

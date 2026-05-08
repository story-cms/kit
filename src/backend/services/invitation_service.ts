import { DateTime } from 'luxon';

import {
  type InvitationItem,
  type InvitationForApi,
  type InvitationVersion,
} from '../../types';
import Invitation from '../models/invitation.js';

export class InvitationService {
  constructor(private version: InvitationVersion) {}

  public async getInvitationItems(): Promise<InvitationItem[]> {
    const invitations = await this.getInvitationsForVersion();
    return invitations
      .map((invitation) => {
        const startDate = invitation.splitWindow[0]?.toISO() ?? null;
        return {
          id: invitation.id,
          name: invitation.bundle.name,
          regions: invitation.bundle.regions,
          window: invitation.bundle.window,
          isPublished: invitation.isPublished,
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

  public async getInvitationItemsForClient(): Promise<InvitationForApi[]> {
    const invitations = await this.getInvitationsForVersion();
    const now = DateTime.now();
    return invitations
      .filter((invitation) => {
        if (!invitation.isPublished) return false;
        const [start, end] = invitation.splitWindow;
        if (!start || !end) return false;

        if (end < now) return false;

        return true;
      })
      .map((invitation) => invitation.forApi)
      .sort((a, b) => {
        // Sort by startDate ascending, nulls at the end
        if (a.startDate === null && b.startDate === null) return 0;
        if (a.startDate === null) return 1;
        if (b.startDate === null) return -1;
        return a.startDate.localeCompare(b.startDate);
      });
  }

  public async getInvitationsForVersion(): Promise<Invitation[]> {
    const invitations = await Invitation.query().where(this.version);
    return invitations;
  }
}

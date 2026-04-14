import admin from 'firebase-admin';
import { type App, type ServiceAccount } from 'firebase-admin/app';
import { type UserRecord } from 'firebase-admin/auth';
import { DateTime } from 'luxon';

import { type AudienceMeta } from '../../types.js';
import { getCredentialsFrom } from './helpers.js';

/** Firebase Admin `listUsers` max batch size. */
export const FIREBASE_MAX_LIST_USERS = 1000;

export type AudienceListPageResult = {
  audiences: AudienceMeta[];
  nextPageToken: string | null;
  hasMore: boolean;
};

const CSV_COLUMNS: { key: keyof AudienceMeta; header: string }[] = [
  { key: 'uid', header: 'UID' },
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'signUpDate', header: 'Signed Up' },
  { key: 'lastSignInTime', header: 'Last Sign In' },
];

let cachedApp: App | undefined;

export class AudienceService {
  public parseListQuery(qs: Record<string, unknown>): {
    perPage: number;
    pageToken: string | undefined;
  } | null {
    const rawPerPage = qs['perPage'];
    const perPageStr = Array.isArray(rawPerPage) ? rawPerPage[0] : rawPerPage;
    let perPage = 10;
    if (perPageStr !== undefined && perPageStr !== null && perPageStr !== '') {
      const n = Number(perPageStr);
      if (!Number.isFinite(n) || n < 1 || n > FIREBASE_MAX_LIST_USERS) {
        return null;
      }
      perPage = n;
    }

    const rawToken = qs['pageToken'];
    const tokenStr = Array.isArray(rawToken) ? rawToken[0] : rawToken;
    const pageToken =
      typeof tokenStr === 'string' && tokenStr.length > 0 ? tokenStr : undefined;

    return { perPage, pageToken };
  }

  public async listUsersPage(
    perPage: number,
    pageToken?: string,
  ): Promise<AudienceListPageResult> {
    const capped = Math.min(Math.max(1, perPage), FIREBASE_MAX_LIST_USERS);

    try {
      const result = await this.getAuth().listUsers(capped, pageToken);
      const audiences = result.users.map(this.toAudienceMeta);
      const nextPageToken = result.pageToken ?? null;

      return { audiences, nextPageToken, hasMore: Boolean(nextPageToken) };
    } catch (error) {
      console.error('Error listing users page:', error);
      throw new Error('Failed to retrieve user list from Firebase.');
    }
  }

  public async getAllUsers(): Promise<AudienceMeta[]> {
    const allUsers: AudienceMeta[] = [];
    let nextPageToken: string | undefined;

    do {
      const page = await this.listUsersPage(FIREBASE_MAX_LIST_USERS, nextPageToken);
      allUsers.push(...page.audiences);
      nextPageToken = page.nextPageToken ?? undefined;
    } while (nextPageToken);

    return allUsers;
  }

  public toCsvFrom(audiences: AudienceMeta[]): string {
    if (audiences.length === 0) return '';

    const headerRow = CSV_COLUMNS.map((c) => this.escapeCsvField(c.header)).join(',');
    const dataRows = audiences.map((row) =>
      CSV_COLUMNS.map((c) => this.escapeCsvField(row[c.key])).join(','),
    );

    return [headerRow, ...dataRows].join('\n');
  }

  private getFirebaseApp(): App {
    if (cachedApp) return cachedApp;

    if (admin.apps.length > 0 && admin.apps[0]) {
      cachedApp = admin.apps[0];
      return cachedApp;
    }

    const credentials: ServiceAccount = getCredentialsFrom(
      'FIREBASE_SERVICE_ACCOUNT_KEY_JSON',
    );
    cachedApp = admin.initializeApp({ credential: admin.credential.cert(credentials) });
    return cachedApp;
  }

  private getAuth() {
    return admin.auth(this.getFirebaseApp());
  }

  private toAudienceMeta(userRecord: UserRecord): AudienceMeta {
    const signUpDate = userRecord.metadata.creationTime
      ? DateTime.fromHTTP(userRecord.metadata.creationTime).toISO()
      : null;

    const lastSignInTime = userRecord.metadata.lastSignInTime
      ? DateTime.fromHTTP(userRecord.metadata.lastSignInTime).toISO()
      : null;

    return {
      uid: userRecord.uid,
      name: userRecord.displayName || '',
      email: userRecord.email || '',
      photoURL:
        userRecord.photoURL ||
        'https://res.cloudinary.com/journeys/image/upload/v1755260359/profile_qblxey.jpg',
      signUpDate: signUpDate || '',
      lastSignInTime: lastSignInTime || '',
    };
  }

  private escapeCsvField(value: unknown): string {
    const str = value === null || value === undefined ? '' : String(value);
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
}

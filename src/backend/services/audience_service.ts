import admin from 'firebase-admin';
import { type App, type ServiceAccount } from 'firebase-admin/app';
import { Auth, type UserRecord } from 'firebase-admin/auth';
import { DateTime } from 'luxon';

import type { AudienceUsersPageResponse, AudienceMeta } from '../../types.js';
import {
  getCredentialsFrom,
  standardAudienceKeys,
  extraAudienceColumns,
  keyToTitle,
} from './helpers.js';

export class AudienceService {
  private app: App;

  constructor() {
    this.app = this.initializeClient();
  }

  /**
   * One page of users from Firebase Auth. Pass `pageToken` from the previous
   * response to fetch the next page; omit for the first page.
   */
  public async listUsersPage(
    maxResults: number,
    pageToken?: string,
  ): Promise<AudienceUsersPageResponse> {
    const listUsersResult = await this.getAuthService().listUsers(maxResults, pageToken);

    const users = listUsersResult.users.map((userRecord: UserRecord) =>
      this.userRecordToMeta(userRecord),
    );

    const nextPageToken = listUsersResult.pageToken ?? null;

    // Sort the users if there are no more users to fetch
    if (nextPageToken === null) {
      users.sort((a: AudienceMeta, b: AudienceMeta) =>
        b.lastSignInTime.localeCompare(a.lastSignInTime),
      );
    }

    return {
      users,
      nextPageToken,
    };
  }

  /**
   * Returns a CSV string of all users.
   * @returns CSV string
   */
  async toCsvFromUsers(): Promise<string> {
    const allUsers = await this.getAuthService().listUsers(1000);
    const audience = allUsers.users.map((user: UserRecord) =>
      this.userRecordToMeta(user),
    );

    if (audience.length === 0) return '';

    const keys = this.getUserKeys(audience[0]);
    const headerRow = keys.map((key) => this.escapeCsvField(keyToTitle(key))).join(',');
    const dataRows = audience.map((row: AudienceMeta) =>
      keys.map((key) => this.escapeCsvField(row[key as keyof AudienceMeta])).join(','),
    );

    return [headerRow, ...dataRows].join('\n');
  }

  private getUserKeys(row: AudienceMeta): string[] {
    return [...standardAudienceKeys, ...extraAudienceColumns(row)];
  }

  private userRecordToMeta(userRecord: UserRecord): AudienceMeta {
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
        'https://res.cloudinary.com/journeys/image/upload/q_auto/f_auto/v1776103874/profile_mopacr.png',
      signUpDate: signUpDate || '',
      lastSignInTime: lastSignInTime || '',
    };
  }

  /**
   * Initializes and returns the Firebase Admin SDK client.
   */
  private initializeClient(): App {
    if (admin.apps && admin.apps.length > 0 && admin.apps[0]) {
      return admin.apps[0];
    }

    const credentials: ServiceAccount = getCredentialsFrom(
      'FIREBASE_SERVICE_ACCOUNT_KEY_JSON',
    );

    return admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });
  }

  /**
   * Returns the Firebase Auth instance.
   */
  private getAuthService(): Auth {
    return admin.auth(this.app);
  }

  private escapeCsvField(value: unknown): string {
    const str = value === null || value === undefined ? '' : String(value);
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
}

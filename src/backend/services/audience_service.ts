import admin from 'firebase-admin';
import { type App, type ServiceAccount } from 'firebase-admin/app';
import { type Auth, type UserRecord } from 'firebase-admin/auth';
import { DateTime } from 'luxon';
import type { AudienceMeta, AudiencesUsersPageResponse } from '../../types';
import { getCredentialsFrom } from './helpers.js';

/**
 * Page size for audience list.
 * Should be less than 1000 because of Firebase Auth API limits.
 */
export const AUDIENCE_LIST_PAGE_SIZE = 800;

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
  ): Promise<AudiencesUsersPageResponse> {
    const listUsersResult = await this.getAuthService().listUsers(maxResults, pageToken);

    const users = listUsersResult.users.map((userRecord) =>
      this.userRecordToMeta(userRecord),
    );

    const nextPageToken = listUsersResult.pageToken ?? null;

    // Sort the users if there are no more users to fetch
    if (nextPageToken === null) {
      users.sort((a, b) => b.lastSignInTime.localeCompare(a.lastSignInTime));
    }

    return {
      users,
      nextPageToken,
    };
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
}

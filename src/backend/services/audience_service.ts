import admin from 'firebase-admin';
import { type App, type ServiceAccount } from 'firebase-admin/app';
import { type Auth, type UserRecord } from 'firebase-admin/auth';
import { DateTime } from 'luxon';
import type { AudienceMeta, AudiencesUsersPageResponse } from '../../types';
import { getCredentialsFrom } from './helpers.js';

/** Page size for audience list (Firebase `listUsers` per request). */
export const AUDIENCE_LIST_PAGE_SIZE = 100;

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

    return {
      users,
      nextPageToken: listUsersResult.pageToken ?? null,
    };
  }

  public async getAllUsers(): Promise<AudienceMeta[]> {
    const allUsers: AudienceMeta[] = [];
    let nextPageToken: string | undefined;

    try {
      do {
        const page = await this.listUsersPage(1000, nextPageToken);
        allUsers.push(...page.users);
        nextPageToken = page.nextPageToken ?? undefined;
      } while (nextPageToken);

      return allUsers;
    } catch (error) {
      console.error('Error listing all users:', error);
      throw new Error('Failed to retrieve user list from Firebase.');
    }
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
        'https://res.cloudinary.com/journeys/image/upload/v1755260359/profile_qblxey.jpg',
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

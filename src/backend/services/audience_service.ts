import admin from 'firebase-admin';
import { type App, type ServiceAccount } from 'firebase-admin/app';
import { type Auth, type UserRecord } from 'firebase-admin/auth';
import { DateTime } from 'luxon';
import type { AudienceMeta } from '../../types';
import { getCredentialsFrom } from './helpers';

export class AudienceService {
  private app: App;

  constructor() {
    this.app = this.initializeClient();
  }

  public async getAllUsers(): Promise<AudienceMeta[]> {
    const allUsers: AudienceMeta[] = [];
    let nextPageToken: string | undefined;

    try {
      do {
        const listUsersResult = await this.getAuthService().listUsers(
          1000,
          nextPageToken,
        );

        listUsersResult.users.forEach((userRecord: UserRecord) => {
          const signUpDate = userRecord.metadata.creationTime
            ? DateTime.fromHTTP(userRecord.metadata.creationTime).toISO()
            : null;

          const lastSignInTime = userRecord.metadata.lastSignInTime
            ? DateTime.fromHTTP(userRecord.metadata.lastSignInTime).toISO()
            : null;

          allUsers.push({
            uid: userRecord.uid,
            name: userRecord.displayName || '',
            email: userRecord.email || '',
            photoURL:
              userRecord.photoURL ||
              'https://res.cloudinary.com/journeys/image/upload/v1755260359/profile_qblxey.jpg',
            signUpDate: signUpDate || '',
            lastSignInTime: lastSignInTime || '',
          });
        });

        nextPageToken = listUsersResult.pageToken;
      } while (nextPageToken);

      return allUsers;
    } catch (error) {
      console.error('Error listing all users:', error);
      throw new Error('Failed to retrieve user list from Firebase.');
    }
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

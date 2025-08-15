import admin from 'firebase-admin';
import { type App, type ServiceAccount } from 'firebase-admin/app';
import { type Auth, type UserRecord } from 'firebase-admin/auth';
import { DateTime } from 'luxon';

export class AudienceService {
  protected config: any;
  private app: App;

  constructor(config: any) {
    this.config = config;
    this.app = this.initializeClient();
  }

  public async getAllUsers(): Promise<any[]> {
    const allUsers: any[] = [];
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

    const credentialsBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON || '';
    if (!credentialsBase64) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_KEY_JSON environment variable is not set.',
      );
    }

    const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
    const serviceAccount: ServiceAccount = JSON.parse(credentialsJson);

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  /**
   * Returns the Firebase Auth instance.
   */
  private getAuthService(): Auth {
    return admin.auth(this.app);
  }
}

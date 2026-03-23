import admin from 'firebase-admin';
import { type App, type ServiceAccount } from 'firebase-admin/app';
import { type Auth, type UserRecord } from 'firebase-admin/auth';
import { DateTime } from 'luxon';
import type { AudienceMeta } from '../../types.js';
import { getCredentialsFrom } from './helpers.js';

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

  /**
   * Exports audience data to CSV.
   */
  public exportToCsv(audiences: AudienceMeta[]): string {
    return this.#toCsv(audiences as unknown as Record<string, unknown>[]);
  }

  /**
   * Escapes a value for RFC 4180 CSV format.
   */
  static #escapeCsvValue(value: unknown): string {
    const str = value === null || value === undefined ? '' : String(value);
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /**
   * Converts an array of records to CSV string.
   */
  #toCsv(rows: Record<string, unknown>[]): string {
    if (rows.length === 0) {
      return '';
    }

    const columns = [
      { key: 'uid', header: 'UID' },
      { key: 'name', header: 'Name' },
      { key: 'email', header: 'Email' },
      { key: 'signUpDate', header: 'Signed Up' },
      { key: 'lastSignInTime', header: 'Last Sign In' },
    ];

    const headerRow = columns
      .map((c) => AudienceService.#escapeCsvValue(c.header))
      .join(',');
    const dataRows = rows.map((row) =>
      columns
        .map((c) =>
          AudienceService.#escapeCsvValue((row as Record<string, unknown>)[c.key]),
        )
        .join(','),
    );

    return [headerRow, ...dataRows].join('\n');
  }
}

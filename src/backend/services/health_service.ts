import db from '@adonisjs/lucid/services/db';
import { DateTime } from 'luxon';

export interface DatabaseHealth {
  database: 'ok';
  databaseCheckedAt: string;
}

export class HealthService {
  public async checkDatabase(
    runQuery: () => Promise<unknown> = () => db.rawQuery('select 1'),
  ): Promise<DatabaseHealth> {
    await runQuery();

    return {
      database: 'ok',
      databaseCheckedAt: DateTime.utc().toISO() as string,
    };
  }
}

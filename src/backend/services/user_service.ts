import Activity from '../models/activity.js';
import User from '../models/user.js';
import db from '@adonisjs/lucid/services/db';

export default class UserService {
  async latest() {
    const activities = await Activity.query()
      .select('userId')
      .select(db.raw('MAX(created_at) as last_activity'))
      .groupBy('userId');

    const users = await User.query().where('name', '!=', 'redacted');

    const list = users.map((user) => {
      const activity = activities.find((a) => a.userId === user.id);
      return {
        ...user.meta,
        lastActivity: activity?.$extras.last_activity || null,
      };
    });

    return list;
  }
}

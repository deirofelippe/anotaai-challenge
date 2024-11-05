import {
  mongoDatabase,
  mongoHost,
  mongoPassword,
  mongoPort,
  mongoUser
} from '../config/env';
import { MongoClient } from 'mongodb';
import { logger } from '../config/logger';

export class MongoInstance {
  private static connection?: MongoClient = undefined;

  private constructor() {}

  public static getInstance() {
    if (!MongoInstance.connection) {
      logger.error({
        context: 'mongodb',
        data: 'A conexão com o MongoDB não foi aberta.'
      });
      throw new Error('A conexão com o MongoDB não foi aberta.');
    }

    return MongoInstance.connection?.db(mongoDatabase);
  }

  public static async connect() {
    if (MongoInstance.connection) {
      return this;
    }

    const url = `mongodb://${mongoHost}:${mongoPort}`;

    const client = new MongoClient(url, {
      auth: { username: mongoUser, password: mongoPassword }
    });
    MongoInstance.connection = await client.connect();
    logger.error({
      context: 'mongodb',
      data: 'MongoDB connection successfully'
    });

    return this;
  }

  public static async close() {
    if (!MongoInstance.connection) {
      return;
    }

    await MongoInstance.connection?.close();
  }
}

import {
  mongoDatabase,
  mongoHost,
  mongoPassword,
  mongoPort,
  mongoUser
} from './env';
import { MongoClient } from 'mongodb';
import { logger } from './Logger';

export class MongoDBSingleton {
  private static connection?: MongoClient = undefined;

  private constructor() {}

  public static getInstance() {
    if (!MongoDBSingleton.connection) {
      logger.error({
        context: 'mongodb',
        data: 'A conexão com o MongoDB não foi aberta.'
      });
      throw new Error('A conexão com o MongoDB não foi aberta.');
    }

    return MongoDBSingleton.connection?.db(mongoDatabase);
  }

  public static async connect() {
    if (MongoDBSingleton.connection) {
      return this;
    }

    const url = `mongodb://${mongoHost}:${mongoPort}`;

    const client = new MongoClient(url, {
      auth: { username: mongoUser, password: mongoPassword }
    });
    MongoDBSingleton.connection = await client.connect();
    logger.debug({
      context: 'mongodb',
      data: 'MongoDB connection successfully'
    });

    return this;
  }

  public static async close() {
    if (!MongoDBSingleton.connection) {
      return;
    }

    await MongoDBSingleton.connection?.close();
  }
}

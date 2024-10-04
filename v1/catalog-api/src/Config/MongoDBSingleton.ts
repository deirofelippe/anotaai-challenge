import {
  mongoDatabase,
  mongoHost,
  mongoPassword,
  mongoPort,
  mongoUser
} from './env';
import { MongoClient } from 'mongodb';

export class MongoDBSingleton {
  private static connection?: MongoClient = undefined;

  private constructor() {}

  public static getInstance() {
    if (!MongoDBSingleton.connection) {
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
    console.log('MongoDB connection successfully');

    return this;
  }

  public static async close() {
    if (!MongoDBSingleton.connection) {
      return;
    }

    await MongoDBSingleton.connection?.close();
  }
}

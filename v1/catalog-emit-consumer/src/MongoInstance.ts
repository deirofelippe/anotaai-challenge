import {
  mongoDatabase,
  mongoHost,
  mongoPassword,
  mongoPort,
  mongoUser
} from './env';
import { MongoClient } from 'mongodb';

export class MongoInstance {
  private static connection?: MongoClient = undefined;

  private constructor() {}

  public static getInstance() {
    if (!MongoInstance.connection) {
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
    console.log('MongoDB connection successfully');

    return this;
  }

  public static async close() {
    if (!MongoInstance.connection) {
      return;
    }

    await MongoInstance.connection?.close();
  }
}

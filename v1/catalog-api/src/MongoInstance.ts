import {
  mongoDatabase,
  mongoHost,
  mongoPassword,
  mongoPort,
  mongoUser
} from './env';
import { MongoClient } from 'mongodb';

export class MongoInstance {
  private static connection: MongoClient;

  private constructor() {}

  public static getInstance() {
    return MongoInstance.connection.db(mongoDatabase);
  }

  public static async connect() {
    if (!MongoInstance.connection) {
      const url = `mongodb://${mongoHost}:${mongoPort}`;

      const client = new MongoClient(url, {
        auth: { username: mongoUser, password: mongoPassword }
      });
      MongoInstance.connection = await client.connect();
    }

    return this;
  }

  public static async close() {
    await MongoInstance.close();
  }
}

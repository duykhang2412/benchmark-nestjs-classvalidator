import { Injectable } from '@nestjs/common';
import { Collection, Document, MongoClient } from 'mongodb';

import {
  APP_DB_TEST,
  APP_IS_TEST,
  MONGO_USER_CLIENT_URL,
} from '../constraint';

@Injectable()
export class MongoDb {
  private client!: MongoClient;

  getCollection<TSchema extends Document = Document>(
    databaseName: string,
    collectionName: string,
  ): Collection<TSchema> {
    if (!this.client) {
      this.client = new MongoClient(MONGO_USER_CLIENT_URL);
    }

    if (APP_IS_TEST) {
      databaseName = `${databaseName}_${APP_DB_TEST}`;
    }

    return this.client.db(databaseName).collection<TSchema>(collectionName);
  }

  async closeConnection(): Promise<void> {
    await this.client.close();
  }
}

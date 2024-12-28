import { Module } from '@nestjs/common';

import { MongoDb } from './mongo-db';
import { userRepository } from './repositories';

@Module({
  imports: [],
  controllers: [],
  providers: [MongoDb, userRepository],
  exports: [userRepository],
})
export class MongoStoreModule { }

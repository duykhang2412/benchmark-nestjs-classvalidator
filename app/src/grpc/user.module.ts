import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { MongoStoreModule } from '../store/mongo-store.module';

@Module({
  imports: [MongoStoreModule],
  controllers: [UserController],
})
export class UserModule { }

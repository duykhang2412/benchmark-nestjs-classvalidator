import { MongoStoreModule } from './../store/mongo-store.module';
// src/app.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  imports: [MongoStoreModule],
  controllers: [UserController],
})
export class UserModule { }

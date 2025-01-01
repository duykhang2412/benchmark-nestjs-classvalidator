import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongoStoreModule } from './store/mongo-store.module';
import { UserModule } from './grpc/user.module';
import { loadConfiguration } from './utils/get-config';

@Module({
  imports: [
    CqrsModule,
    MongoStoreModule,
    UserModule,
    ConfigModule.forRoot({
      load: [loadConfiguration],
      isGlobal: true,
    }),
  ],
  controllers: [],
})
export class GrpcModule { }

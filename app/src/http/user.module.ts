import { Module } from '@nestjs/common';
import { AppController } from './user.controller';

@Module({
  controllers: [AppController],
})
export class AppModule { }

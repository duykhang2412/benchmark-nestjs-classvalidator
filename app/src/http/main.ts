import { NestFactory } from '@nestjs/core';
import { AppModule } from './user.module';
import { Logger } from '@nestjs/common';
import { HTTP_PORT } from '../constraint';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(HTTP_PORT);
  Logger.log(`Application is running on port ${HTTP_PORT}`);
}



import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HTTP_PORT, PACKAGE, VERSION, LOG_LEVEL } from '../constraint';
import { Logger } from '@nestjs/common';

export async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: LOG_LEVEL, // Set the log level for the application
  });

  await app.listen(HTTP_PORT);
  logger.log(`${PACKAGE}@${VERSION} started at port ${HTTP_PORT}`);
}


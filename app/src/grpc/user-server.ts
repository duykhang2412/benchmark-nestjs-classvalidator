import { Logger, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { dirname, resolve } from 'path';

import { UserModule } from '../grpc/user.module';
import { cwd } from 'process';
import { loadConfiguration } from 'src/utils/get-config';
import { GRPC_PORT } from '../constraint';

const config = new ConfigService(loadConfiguration());
// const SERVICE_PORT = config.get('service.port');
const packageMeta = require(resolve('package.json'));
const PACKAGE = packageMeta.name;
const VERSION = packageMeta.version;
const LOG_LEVEL = config.get('log.level', [
  'log',
  'error',
  'warn',
] as LogLevel[]);

async function bootstrap() {
  const options = {
    url: `0.0.0.0:${GRPC_PORT}`,
    package: ['user'],
    protoPath: [
      require.resolve(
        `${cwd()}/proto/user.proto`,
      ),
    ],
    loader: {
      includeDirs: [
        dirname(require.resolve('google-proto-files/package.json')),
        dirname(require.resolve(`${cwd()}/package.json`)),
      ],
    },
    ...config.get('grpc.options', {}),
  };

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    { transport: Transport.GRPC, options, logger: LOG_LEVEL },
  );

  Logger.log('GRPC server initializing', options, UserModule.name);

  await app.listen();
}

bootstrap().then(() =>
  Logger.log(
    `${PACKAGE}@${VERSION} started at port ${GRPC_PORT}`,
    UserModule.name,
  ),
);

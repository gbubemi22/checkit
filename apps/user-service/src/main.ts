import 'dotenv/config';
import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import {
  USER_PACKAGE_NAME,
  USER_PROTO_PATH,
} from '../../../packages/proto/src';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    bufferLogs: true,
    transport: Transport.GRPC,
    options: {
      package: USER_PACKAGE_NAME,
      protoPath: USER_PROTO_PATH,
      url: process.env.USER_SERVICE_GRPC_BIND_URL ,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();

  const logger = new Logger('UserServiceBootstrap');
  logger.log(`gRPC server running on ${process.env.USER_SERVICE_GRPC_BIND_URL ?? '0.0.0.0:50051'}`);
}

void bootstrap();

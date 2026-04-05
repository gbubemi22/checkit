import "dotenv/config";
import "reflect-metadata";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import {
  WALLET_PACKAGE_NAME,
  WALLET_PROTO_PATH,
} from "../../../packages/proto/src";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    bufferLogs: true,
    transport: Transport.GRPC,
    options: {
      package: WALLET_PACKAGE_NAME,
      protoPath: WALLET_PROTO_PATH,
      url: process.env.WALLET_SERVICE_GRPC_BIND_URL,
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

  const logger = new Logger("WalletServiceBootstrap");
  logger.log(
    `gRPC server running on ${process.env.WALLET_SERVICE_GRPC_BIND_URL}`,
  );
}

void bootstrap();

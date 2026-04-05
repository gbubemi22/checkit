import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import {
  WALLET_PACKAGE_NAME,
  WALLET_PROTO_PATH,
} from "../../../../packages/proto/src";
import { WalletController } from "./controller/wallet.controller";
import { WalletGrpcClientService } from "./service/wallet.grpc-client.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "WALLET_PACKAGE",
        transport: Transport.GRPC,
        options: {
          package: WALLET_PACKAGE_NAME,
          protoPath: WALLET_PROTO_PATH,
          url: process.env.WALLET_SERVICE_GRPC_URL as string,
        },
      },
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletGrpcClientService],
})
export class WalletModule {}

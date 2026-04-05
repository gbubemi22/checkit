import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  WALLET_PACKAGE_NAME,
  WALLET_PROTO_PATH,
} from '../../../../../packages/proto/src';
import { WalletGrpcClientService } from './wallet-grpc-client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WALLET_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: WALLET_PACKAGE_NAME,
          protoPath: WALLET_PROTO_PATH,
          url: process.env.WALLET_SERVICE_GRPC_URL,
        },
      },
    ]),
  ],
  providers: [WalletGrpcClientService],
  exports: [WalletGrpcClientService],
})
export class WalletModule {}

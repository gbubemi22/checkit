import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  USER_PACKAGE_NAME,
  USER_PROTO_PATH,
} from '../../../../packages/proto/src';
import { UserController } from './controller/user.controller';
import { UserGrpcClientService } from './service/user.grpc-client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          protoPath: USER_PROTO_PATH,
          url: process.env.USER_SERVICE_GRPC_URL as string,
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserGrpcClientService],
})
export class UserModule {}

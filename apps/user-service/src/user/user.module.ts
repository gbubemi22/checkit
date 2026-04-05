import { Module } from '@nestjs/common';
import { UserGrpcController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [WalletModule],
  controllers: [UserGrpcController],
  providers: [UserService],
})
export class UserModule {}

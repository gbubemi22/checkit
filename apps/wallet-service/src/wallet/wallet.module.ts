import { Module } from '@nestjs/common';
import { WalletService } from './service/wallet.service';
import { UserModule } from './user/user.module';
import { WalletGrpcController } from './controller/wallet.controller';

@Module({
  imports: [UserModule],
  controllers: [WalletGrpcController],
  providers: [WalletService],
})
export class WalletModule {}

import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import {
  CreateWalletDto,
  UpdateWalletBalanceDto,
} from '../../../../../packages/contracts/src';
import { WalletGrpcClientService } from '../service/wallet.grpc-client.service';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletClient: WalletGrpcClientService) {}

  @Post()
  async createWallet(@Body() payload: CreateWalletDto) {
    return {
      data: await this.walletClient.createWallet(payload),
    };
  }

  @Get(':userId')
  async getWallet(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return {
      data: await this.walletClient.getWallet({ userId }),
    };
  }

  @Post('credit')
  async creditWallet(@Body() payload: UpdateWalletBalanceDto) {
    return {
      data: await this.walletClient.creditWallet(payload),
    };
  }

  @Post('debit')
  async debitWallet(@Body() payload: UpdateWalletBalanceDto) {
    return {
      data: await this.walletClient.debitWallet(payload),
    };
  }
}

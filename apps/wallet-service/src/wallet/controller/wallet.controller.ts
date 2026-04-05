import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod, Payload } from "@nestjs/microservices";
import { Prisma } from "@prisma/client";
import {
  CreateWalletDto,
  GetWalletDto,
  UpdateWalletBalanceDto,
} from "../../../../../packages/contracts/src";
import { WALLET_SERVICE_NAME } from "../../../../../packages/proto/src/wallet.pb";
import { WalletService } from "../service/wallet.service";

@Controller()
export class WalletGrpcController {
  private readonly logger = new Logger(WalletGrpcController.name);

  constructor(private readonly walletService: WalletService) {}

  @GrpcMethod(WALLET_SERVICE_NAME, "CreateWallet")
  async createWallet(@Payload() payload: CreateWalletDto) {
    return await this.walletService.createWallet(payload);
  }

  @GrpcMethod(WALLET_SERVICE_NAME, "GetWallet")
  async getWallet(@Payload() payload: GetWalletDto) {
    return await this.walletService.getWallet(payload.userId);
  }

  @GrpcMethod(WALLET_SERVICE_NAME, "CreditWallet")
  async creditWallet(@Payload() payload: UpdateWalletBalanceDto) {
    return await this.walletService.creditWallet(payload);
  }

  @GrpcMethod(WALLET_SERVICE_NAME, "DebitWallet")
  async debitWallet(@Payload() payload: UpdateWalletBalanceDto) {
    return await this.walletService.debitWallet(payload);
  }
}

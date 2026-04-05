import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import {
  WALLET_SERVICE_NAME,
  WalletServiceClient,
} from "packages/proto/src/wallet.pb";
import { firstValueFrom } from "rxjs";

@Injectable()
export class WalletGrpcClientService implements OnModuleInit {
  private readonly logger = new Logger(WalletGrpcClientService.name);
  private walletService!: WalletServiceClient;

  constructor(@Inject("WALLET_PACKAGE") private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.walletService =
      this.client.getService<WalletServiceClient>(WALLET_SERVICE_NAME);
  }

  async createWallet(userId: string) {
    this.logger.log(`Creating wallet for user ${userId}`);
    return firstValueFrom(this.walletService.createWallet({ userId }));
  }
}

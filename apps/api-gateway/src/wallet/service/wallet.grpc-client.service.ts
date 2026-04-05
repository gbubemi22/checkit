import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { toHttpException } from "../../../../../packages/proto/src";
import {
  CommonResponseObj,
  CreateWalletRequest,
  GetWalletRequest,
  UpdateWalletBalanceRequest,
  WALLET_SERVICE_NAME,
  WalletServiceClient,
} from "../../../../../packages/proto/src/wallet.pb";

@Injectable()
export class WalletGrpcClientService implements OnModuleInit {
  private svc!: WalletServiceClient;

  constructor(@Inject("WALLET_PACKAGE") private readonly client: ClientGrpc) {}

  public onModuleInit(): void {
    this.svc = this.client.getService<WalletServiceClient>(WALLET_SERVICE_NAME);
  }

  async createWallet(payload: CreateWalletRequest): Promise<CommonResponseObj> {
    try {
      return await firstValueFrom(this.svc.createWallet(payload));
    } catch (error) {
      throw toHttpException(error);
    }
  }

  async getWallet(payload: GetWalletRequest): Promise<CommonResponseObj> {
    try {
      return await firstValueFrom(this.svc.getWallet(payload));
    } catch (error) {
      throw toHttpException(error);
    }
  }

  async creditWallet(
    payload: UpdateWalletBalanceRequest,
  ): Promise<CommonResponseObj> {
    try {
      return await firstValueFrom(this.svc.creditWallet(payload));
    } catch (error) {
      throw toHttpException(error);
    }
  }

  async debitWallet(
    payload: UpdateWalletBalanceRequest,
  ): Promise<CommonResponseObj> {
    try {
      return await firstValueFrom(this.svc.debitWallet(payload));
    } catch (error) {
      throw toHttpException(error);
    }
  }
}

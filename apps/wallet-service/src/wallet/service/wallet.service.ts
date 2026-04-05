import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../packages/prisma/src/prisma.service";
import {
  CommonResponseObj,
  CreateWalletRequest,
  UpdateWalletBalanceRequest,
} from "../../../../../packages/proto/src/wallet.pb";

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async createWallet(payload: CreateWalletRequest): Promise<CommonResponseObj> {
    const { userId } = payload;

    const checkWallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (checkWallet) {
      throw new BadRequestException("Wallet already exists for this user");
    }

    const wallet = await this.prisma.wallet.create({
      data: {
        userId,
      },
    });

    return {
      status: 201,
      success: true,
      message: "Wallet created successfully",
      data: wallet,
    };
  }

  async getWallet(userId: string): Promise<CommonResponseObj> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException("Wallet not found");
    }

    return {
      status: 200,
      success: true,
      message: "Wallet retrieved successfully",
      data: wallet,
    };
  }

  async creditWallet(
    payload: UpdateWalletBalanceRequest,
  ): Promise<CommonResponseObj> {
    try {
      const { userId, amount } = payload;

      const wallet = await this.prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const wallet = await tx.wallet.findUnique({
            where: { userId: userId },
          });

          if (!wallet) {
            throw new NotFoundException("Wallet not found");
          }

          const updatedWallet = await tx.wallet.update({
            where: { id: wallet.id },
            data: {
              balance: {
                increment: amount,
              },
            },
          });

          return {
            status: 200,
            success: true,
            message: "Wallet credited successfully",
            data: updatedWallet,
          };
        },
      );

      return wallet;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: "An error occurred while updating the wallet",
        data: {},
      };
    }
  }

  async debitWallet(
    payload: UpdateWalletBalanceRequest,
  ): Promise<CommonResponseObj> {
    const { userId, amount } = payload;

    const wallet = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const wallet = await tx.wallet.findUnique({
          where: { userId: userId },
        });

        if (!wallet) {
          return {
            status: 404,
            success: false,
            message: "Wallet not found",
            data: {},
          };
        }

        if (wallet.balance < amount) {
          return {
            status: 400,
            success: false,
            message: "Insufficient balance",
            data: {},
          };
        }

        const updatedWallet = await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: {
              decrement: amount,
            },
          },
        });

        return {
          status: 200,
          success: true,
          message: "Wallet debited successfully",
          data: updatedWallet,
        };
      },
    );

    return wallet;
  }
}

import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../../packages/prisma/src/prisma.service";
import { WalletGrpcClientService } from "../user/wallet/wallet-grpc-client.service";
import {
  CommonResponseObj,
  CreateUserRequest,
} from "packages/proto/src/user.pb";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly walletClient: WalletGrpcClientService,
  ) {}

  async createUser(payload: CreateUserRequest): Promise<CommonResponseObj> {
    const { email, name } = payload;

    const checkEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (checkEmail) {
      return {
        status: 409,
        success: false,
        message: "Email already exists",
      };
    }

    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
      },
    });

    await this.walletClient.createWallet(user.id);

    return {
      status: 201,
      success: true,
      message: "User created successfully",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  async getUserById(id: string): Promise<CommonResponseObj> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return {
        status: 404,
        success: false,
        message: "User not found",
        data: {},
      };
    }

    return {
      status: 200,
      success: true,
      message: "User retrieved successfully",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }
}

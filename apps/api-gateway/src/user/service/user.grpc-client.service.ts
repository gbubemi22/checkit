import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { toHttpException } from "../../../../../packages/proto/src";
import {
  CommonResponseObj,
  CreateUserRequest,
  GetUserByIdRequest,
  USER_SERVICE_NAME,
  UserServiceClient,
} from "../../../../../packages/proto/src/user.pb";

@Injectable()
export class UserGrpcClientService implements OnModuleInit {
  private svc!: UserServiceClient;

  constructor(@Inject("USER_PACKAGE") private readonly client: ClientGrpc) {}

  public onModuleInit(): void {
    this.svc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async createUser(payload: CreateUserRequest): Promise<CommonResponseObj> {
    try {
      return await firstValueFrom(this.svc.createUser(payload));
    } catch (error) {
      throw toHttpException(error);
    }
  }

  async getUserById(payload: GetUserByIdRequest): Promise<CommonResponseObj> {
    try {
      return await firstValueFrom(this.svc.getUserById(payload));
    } catch (error) {
      throw toHttpException(error);
    }
  }
}

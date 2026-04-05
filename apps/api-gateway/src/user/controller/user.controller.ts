import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from "@nestjs/common";
import { CreateUserDto } from "../../../../../packages/contracts/src";
import { UserGrpcClientService } from "../service/user.grpc-client.service";

@Controller("users")
export class UserController {
  constructor(private readonly userClient: UserGrpcClientService) {}

  @Post("register")
  async createUser(@Body() payload: CreateUserDto) {
    return this.userClient.createUser(payload);
  }

  @Get(":id")
  async getUserById(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.userClient.getUserById({ id });
  }
}

import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod, Payload } from "@nestjs/microservices";
import {
  CreateUserDto,
  GetUserByIdDto,
} from "../../../../packages/contracts/src";
import { USER_SERVICE_NAME } from "../../../../packages/proto/src/user.pb";
import { UserService } from "../service/user.service";

@Controller()
export class UserGrpcController {
  private readonly logger = new Logger(UserGrpcController.name);

  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_SERVICE_NAME, "CreateUser")
  async createUser(@Payload() payload: CreateUserDto) {
    console.log("I GOT TO USER-SERVICE");
    return await this.userService.createUser(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, "GetUserById")
  async getUserById(@Payload() payload: GetUserByIdDto) {
    return await this.userService.getUserById(payload.id);
  }
}

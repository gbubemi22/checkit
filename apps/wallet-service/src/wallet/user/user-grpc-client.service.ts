import { Inject, Injectable, Logger, NotFoundException, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  USER_SERVICE_NAME,
  UserServiceClient,
} from '../../../../../packages/proto/src/user.pb';

@Injectable()
export class UserGrpcClientService implements OnModuleInit {
  private readonly logger = new Logger(UserGrpcClientService.name);
  private userService!: UserServiceClient;

  constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.userService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async getUserById(id: string) {
    this.logger.log(`Verifying user ${id} before wallet creation`);

    try {
      return await firstValueFrom(this.userService.getUserById({ id }));
    } catch (error) {
      const grpcError = error as { code?: number; details?: string; message?: string };

      if (grpcError.code === status.NOT_FOUND) {
        throw new NotFoundException(grpcError.details ?? 'User not found');
      }

      throw new ServiceUnavailableException(grpcError.details ?? grpcError.message ?? 'User service is unavailable');
    }
  }
}

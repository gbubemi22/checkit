import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { status } from '@grpc/grpc-js';

export function toHttpException(error: unknown): HttpException {
  if (error instanceof HttpException) {
    return error;
  }

  const grpcError = error as { code?: number; details?: string; message?: string };
  const message = grpcError.details ?? grpcError.message ?? 'Internal server error';

  switch (grpcError.code) {
    case status.INVALID_ARGUMENT:
      return new BadRequestException(message);
    case status.UNAUTHENTICATED:
      return new UnauthorizedException(message);
    case status.PERMISSION_DENIED:
      return new ForbiddenException(message);
    case status.NOT_FOUND:
      return new NotFoundException(message);
    case status.ALREADY_EXISTS:
      return new ConflictException(message);
    case status.UNAVAILABLE:
      return new ServiceUnavailableException(message);
    default:
      return new InternalServerErrorException(message);
  }
}

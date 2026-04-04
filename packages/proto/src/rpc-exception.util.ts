import { status } from '@grpc/grpc-js';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

const HTTP_TO_GRPC_STATUS: Partial<Record<number, status>> = {
  [HttpStatus.BAD_REQUEST]: status.INVALID_ARGUMENT,
  [HttpStatus.UNAUTHORIZED]: status.UNAUTHENTICATED,
  [HttpStatus.FORBIDDEN]: status.PERMISSION_DENIED,
  [HttpStatus.NOT_FOUND]: status.NOT_FOUND,
  [HttpStatus.CONFLICT]: status.ALREADY_EXISTS,
  [HttpStatus.TOO_MANY_REQUESTS]: status.RESOURCE_EXHAUSTED,
  [HttpStatus.NOT_IMPLEMENTED]: status.UNIMPLEMENTED,
  [HttpStatus.SERVICE_UNAVAILABLE]: status.UNAVAILABLE,
};

export function toRpcException(error: unknown): RpcException {
  if (error instanceof RpcException) {
    return error;
  }

  if (error instanceof HttpException) {
    const response = error.getResponse();
    const message =
      typeof response === 'string'
        ? response
        : (response as { message?: string | string[] }).message ?? error.message;

    return new RpcException({
      code: HTTP_TO_GRPC_STATUS[error.getStatus()] ?? status.INTERNAL,
      message: Array.isArray(message) ? message.join(', ') : message,
    });
  }

  if (error instanceof Error) {
    return new RpcException({
      code: status.INTERNAL,
      message: error.message,
    });
  }

  return new RpcException({
    code: status.INTERNAL,
    message: 'Internal server error',
  });
}

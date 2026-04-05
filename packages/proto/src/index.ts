import { join } from 'path';

export const USER_PACKAGE_NAME = 'user';
export const USER_PROTO_PATH = join(process.cwd(), 'packages/proto/user.proto');

export const WALLET_PACKAGE_NAME = 'wallet';
export const WALLET_PROTO_PATH = join(process.cwd(), 'packages/proto/wallet.proto');

export * from './grpc-http-exception.util';
export {
  USER_SERVICE_NAME,
  UserServiceControllerMethods,
} from './user.pb';
export {
  WALLET_SERVICE_NAME,
  WalletServiceControllerMethods,
} from './wallet.pb';

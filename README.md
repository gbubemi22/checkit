# Backend Assessment: Wallet System

This repository contains a NestJS monorepo built around a small microservice architecture:

- `api-gateway` exposes the HTTP API
- `user-service` is a gRPC microservice for user operations
- `wallet-service` is a gRPC microservice for wallet operations

This setup keeps external transport concerns in one place while internal service-to-service communication stays on gRPC.

## Architecture

```text
backend-assessment/
├── apps/
│   ├── api-gateway/
│   ├── user-service/
│   └── wallet-service/
├── docs/
├── packages/
│   ├── contracts/
│   ├── prisma/
│   └── proto/
├── docker-compose.yml
├── Makefile
└── README.md
```

### Request flow

1. Client sends HTTP request to `api-gateway`
2. `api-gateway` calls the target microservice over gRPC
3. `wallet-service` calls `user-service` over gRPC when it needs to verify a user
4. Both microservices persist data through Prisma to PostgreSQL

## Service responsibilities

### `api-gateway`

- owns all HTTP endpoints
- validates incoming requests
- translates gRPC errors into HTTP responses
- emits structured request logs with `nestjs-pino`

### `user-service`

- `CreateUser`
- `GetUserById`
- automatically provisions a wallet by calling `WalletService.CreateWallet`

### `wallet-service`

- `CreateWallet`
- `GetWallet`
- `CreditWallet`
- `DebitWallet`
- verifies user existence by calling `UserService.GetUserById`

## Shared packages

- [packages/contracts/src/index.ts](/home/jay/Desktop/check/packages/contracts/src/index.ts): shared DTOs for validated request payloads
- [packages/proto/src/index.ts](/home/jay/Desktop/check/packages/proto/src/index.ts): shared gRPC constants, interfaces, and error helpers
- [packages/prisma/src/prisma.module.ts](/home/jay/Desktop/check/packages/prisma/src/prisma.module.ts): shared Prisma module

## Tech stack

- NestJS
- gRPC
- Prisma ORM
- PostgreSQL
- class-validator
- nestjs-pino
- npm workspaces

## Prerequisites

- Node.js 22+
- npm 10+
- Docker / Docker Compose

## Environment setup

1. Copy the environment file:

```bash
cp .env.example .env
```

2. Start PostgreSQL:

```bash
docker compose up -d
```

Or:

```bash
make db-up
```

3. Install dependencies:

```bash
npm install
```

Or:

```bash
make install
```

4. Regenerate TypeScript proto bindings after editing `.proto` files:

```bash
npm run proto:generate
```

Or:

```bash
make proto-generate
```

You can also generate each service binding separately:

```bash
npm run proto:user
npm run proto:wallet
```

## Prisma setup

Generate the Prisma client:

```bash
npm run prisma:generate
```

Or:

```bash
make prisma-generate
```

Create or apply migrations:

```bash
npm run prisma:migrate
```

Or:

```bash
make prisma-migrate
```

The Prisma schema lives at [packages/prisma/prisma/schema.prisma](/home/jay/Desktop/check/packages/prisma/prisma/schema.prisma).

## Running the services

Start the API gateway:

```bash
npm run start:gateway
```

Or:

```bash
make start-gateway
```

Start the user service:

```bash
npm run start:user
```

Or:

```bash
make start-user
```

Start the wallet service:

```bash
npm run start:wallet
```

Or:

```bash
make start-wallet
```

### Default ports

- API Gateway HTTP: `4000`
- User Service gRPC: `5001`
- Wallet Service gRPC: `5002`

All gateway HTTP routes are prefixed with `v1`.

## Contracts

### gRPC proto files

- [packages/proto/user.proto](/home/jay/Desktop/check/packages/proto/user.proto)
- [packages/proto/wallet.proto](/home/jay/Desktop/check/packages/proto/wallet.proto)

### User service methods

- `CreateUser`
- `GetUserById`

### Wallet service methods

- `CreateWallet`
- `GetWallet`
- `CreditWallet`
- `DebitWallet`

## Behavior notes

- Creating a user automatically creates a wallet.
- `CreateWallet` is idempotent for the same user.
- `DebitWallet` uses a Prisma transaction.
- Validation is shared through the contracts package.
- The gateway is the only HTTP entry point.
- The gateway uses structured JSON logging through `nestjs-pino`.

## Example HTTP requests

You can use [docs/api-examples.sh](/home/jay/Desktop/check/docs/api-examples.sh) or [docs/wallet-system.postman_collection.json](/home/jay/Desktop/check/docs/wallet-system.postman_collection.json).

### Create user

```bash
curl --request POST http://localhost:4000/v1/users/register \
  --header 'Content-Type: application/json' \
  --data '{
    "email": "ada@example.com",
    "name": "Ada Lovelace"
  }'
```

### Create wallet

```bash
curl --request POST http://localhost:4000/v1/wallets \
  --header 'Content-Type: application/json' \
  --data '{
    "userId": "f7bdb53c-52cf-4d6f-8ec8-bb86bcb06f0d"
  }'
```

### Credit wallet

```bash
curl --request POST http://localhost:4000/v1/wallets/credit \
  --header 'Content-Type: application/json' \
  --data '{
    "userId": "f7bdb53c-52cf-4d6f-8ec8-bb86bcb06f0d",
    "amount": 100
  }'
```

### Debit wallet

```bash
curl --request POST http://localhost:4000/v1/wallets/debit \
  --header 'Content-Type: application/json' \
  --data '{
    "userId": "f7bdb53c-52cf-4d6f-8ec8-bb86bcb06f0d",
    "amount": 25
  }'
```

### Get wallet

```bash
curl http://localhost:4000/v1/wallets/f7bdb53c-52cf-4d6f-8ec8-bb86bcb06f0d
```

## Example gRPC requests

Create a user:

```bash
grpcurl -plaintext -d '{"email":"ada@example.com","name":"Ada Lovelace"}' \
  localhost:5001 user.UserService/CreateUser
```

Get a user:

```bash
grpcurl -plaintext -d '{"id":"f7bdb53c-52cf-4d6f-8ec8-bb86bcb06f0d"}' \
  localhost:5001 user.UserService/GetUserById
```

Create or fetch a wallet:

```bash
grpcurl -plaintext -d '{"userId":"f7bdb53c-52cf-4d6f-8ec8-bb86bcb06f0d"}' \
  localhost:5002 wallet.WalletService/CreateWallet
```

Credit a wallet:

```bash
grpcurl -plaintext -d '{"userId":"f7bdb53c-52cf-4d6f-8ec8-bb86bcb06f0d","amount":100}' \
  localhost:5002 wallet.WalletService/CreditWallet
```

Debit a wallet:

```bash
grpcurl -plaintext -d '{"userId":"f7bdb53c-52cf-4d6f-8ec8-bb86bcb06f0d","amount":25}' \
  localhost:5002 wallet.WalletService/DebitWallet
```

Get a wallet:

```bash
grpcurl -plaintext -d '{"userId":"f7bdb53c-52cf-4d6f-8ec8-bb86bcb06f0d"}' \
  localhost:5002 wallet.WalletService/GetWallet
```



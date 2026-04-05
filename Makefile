.PHONY: install db-up db-down proto-generate proto-user proto-wallet prisma-generate prisma-migrate prisma-deploy start-gateway start-user start-wallet dev-gateway dev-user dev-wallet build

install:
	npm install

db-up:
	docker compose up -d

db-down:
	docker compose down

proto-generate:
	npm run proto:generate

proto-user:
	npm run proto:user

proto-wallet:
	npm run proto:wallet

prisma-generate:
	npm run prisma:generate

prisma-migrate:
	npm run prisma:migrate

prisma-deploy:
	npm run prisma:deploy

start-gateway:
	npm run start:gateway

start-user:
	npm run start:user

start-wallet:
	npm run start:wallet

dev-gateway:
	npm run dev:gateway

dev-user:
	npm run dev:user

dev-wallet:
	npm run dev:wallet

build:
	npm run build

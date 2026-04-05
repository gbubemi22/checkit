#!/usr/bin/env bash

# Replace USER_ID with the id returned from the create-user request.

curl --request POST http://localhost:4000/v1/users/register \
  --header 'Content-Type: application/json' \
  --data '{
    "email": "ada@example.com",
    "name": "Ada Lovelace"
  }'

curl --request POST http://localhost:4000/v1/wallets \
  --header 'Content-Type: application/json' \
  --data '{
    "userId": "USER_ID"
  }'

curl --request POST http://localhost:4000/v1/wallets/credit \
  --header 'Content-Type: application/json' \
  --data '{
    "userId": "USER_ID",
    "amount": 100
  }'

curl --request POST http://localhost:4000/v1/wallets/debit \
  --header 'Content-Type: application/json' \
  --data '{
    "userId": "USER_ID",
    "amount": 25
  }'

curl http://localhost:4000/v1/wallets/USER_ID

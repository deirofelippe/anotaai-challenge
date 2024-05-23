#!/bin/bash

ROOT_PATH=$(pwd)

# cd "$ROOT_PATH"/signoz/clickhouse-setup/
# docker compose -f ./docker-compose.yaml up -d

cd "$ROOT_PATH"

echo "Iniciando containers..."
docker compose -f ./docker-compose.yaml up -d

echo "Executando producer..."
docker compose exec producer npm run dev &

echo "Executando consumer..."
docker compose exec consumer npm run dev &

cd terraform

echo "Iniciando terraform..."
terraform init

echo "Construindo infra..."
terraform apply -auto-approve

cd "$ROOT_PATH"/scripts-k6

echo "Executando teste de carga..."
./k6 run script.js
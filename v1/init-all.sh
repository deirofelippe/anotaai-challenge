#!/bin/bash

ROOT_PATH=$(pwd)

cd "$ROOT_PATH"

echo "Criando network..."
docker network create --driver bridge desafio

echo "Iniciando containers principais..."
docker compose -f ./docker-compose-main.yaml up -d --build

echo "Iniciando containers de observability..."
docker compose -f ./docker-compose-observability.yaml up -d --build

cd terraform

echo "Iniciando terraform..."
terraform init

echo "Construindo infra..."
terraform apply -auto-approve

cd "$ROOT_PATH"

echo "Executando teste de carga..."
make k6-run
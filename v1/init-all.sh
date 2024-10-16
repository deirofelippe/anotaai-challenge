#!/bin/bash

ROOT_PATH=$(pwd)

cd "$ROOT_PATH"

echo "Criando network..."
make create-network

echo "Iniciando containers principais..."
make up-main-containers

echo "Iniciando containers de observability..."
make up-observability-containers

cd terraform

echo "Iniciando terraform..."
terraform init

echo "Construindo infra..."
terraform apply -auto-approve

cd "$ROOT_PATH"

echo "Executando teste de carga..."
make k6-run
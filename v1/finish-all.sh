#!/bin/bash

echo "Fechando containers principais..."
docker compose -f ./docker-compose-main.yaml down

echo "Fechando containers de observability..."
docker compose -f ./docker-compose-observability.yaml down

echo "Removendo network..."
docker network rm desafio
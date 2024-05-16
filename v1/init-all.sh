#!/bin/bash

ROOT_PATH=$(pwd)

# cd "$ROOT_PATH"/signoz/clickhouse-setup/
# docker compose -f ./docker-compose.yaml up -d

cd "$ROOT_PATH"
docker compose -f ./docker-compose.yaml up -d

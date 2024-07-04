#!/bin/bash

ROOT_PATH=$(pwd)

cd "$ROOT_PATH"
docker compose -f ./docker-compose.yaml down

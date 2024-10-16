#!/bin/bash

echo "Fechando containers principais..."
make down-main-containers

echo "Fechando containers de observability..."
make down-observability-containers

echo "Removendo network..."
make remove-network
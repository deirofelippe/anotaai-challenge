init-all:
	@./init-all.sh
finish-all:
	@./finish-all.sh

create-network:
	@docker network create --driver bridge desafio

up-containers: up-main-containers up-observability-containers
up-main-containers:
	@docker compose -f ./docker-compose-main.yaml up -d --build
up-observability-containers:
	@docker compose -f ./docker-compose-observability.yaml up -d --build

restart-containers: up-main-containers up-observability-containers
restart-main-containers:
	@docker compose -f ./docker-compose-main.yaml restart
restart-observability-containers:
	@docker compose -f ./docker-compose-observability.yaml restart

remove-containers:
	@docker container rm -f $$(docker container ls -a -q)

list-containers:
	@docker container ls -a --format '{{ json . }}' | jq '{ Names, Status, Ports }'
list-main-containers:
	@docker container ls -a --format '{{ json . }}' --filter 'label=group=main' | jq '{ Names, Status, Ports }'
list-observability-containers:
	@docker container ls -a --format '{{ json . }}' --filter 'label=group=observability' | jq '{ Names, Status, Ports }'

ci-cd:
	@gh extension exec act --secret-file .act-secrets -C ../ 

exec-producer:
	@docker container exec -it producer ash
logs-producer:
	@docker container logs -f producer

exec-develop:
	@docker container exec -it develop ash
exec-develop-root:
	@docker container exec -it -u root develop ash

exec-consumer:
	@docker container exec -it consumer ash
logs-consumer:
	@docker container logs -f consumer

exec-mongo:
	@docker container exec -it mongodb mongosh -u admin -p password --host mongodb

k6-build:
	@docker container run --rm --name k6 -w /app -v $$(pwd)/k6/:/app -u $$(id -u):$$(id -g) grafana/xk6:0.11.0 build v0.51.0 --with github.com/szkiba/xk6-faker@v0.3.0
k6-run:
	@./k6/k6 run --out json=./k6/metrics.json --out influxdb=http://localhost:8086/k6 ./k6/index.js
k6-run-k8s:
	@./k6/k6 run --out json=./k6/metrics.json ./k6/index.js

k8s-apply:
	@kubectl apply -f k8s/services.yaml -f k8s/deployments.yaml -f k8s/configmaps.yaml -f k8s/hpa.yaml -f k8s/metric-server.yaml
k8s-hpa-watch:
	@watch -n 1 "kubectl get hpa producer-hpa"
k8s-delete:
	@kubectl delete all --all
k8s-pods:
	@kubectl get pods
k8s-services:
	@kubectl get services
k8s-deployments:
	@kubectl get deployments
k8s-pf-producer:
	@kubectl port-forward service/producer 3000:3000
k8s-pf-localstack:
	@kubectl port-forward service/localstack 4566:4566
k8s-config-ns:
	@kubectl create namespace anotaai ;
	@kubectl config set-context --current --namespace=anotaai
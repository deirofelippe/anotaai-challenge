init-all:
	@./init-all.sh
finish-all:
	@./finish-all.sh

up-containers: up-main-containers up-observability-containers
up-main-containers:
	@docker compose -f ./docker-compose-main.yaml up -d
up-observability-containers:
	@docker compose -f ./docker-compose-observability.yaml up -d

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

app-producer:
	@docker compose exec -it producer ash
logs-producer:
	@docker compose logs -f producer

app-consumer:
	@docker compose exec -it consumer ash
logs-consumer:
	@docker compose logs -f consumer

k6-build:
	@docker container run --rm --name k6 -w /app -v $$(pwd)/k6/:/app -u $$(id -u):$$(id -g) grafana/xk6:0.11.0 build v0.51.0 --with github.com/szkiba/xk6-faker@v0.3.0
k6-run-bin:
	@./k6/k6 run --out json=./k6/metrics.json --out influxdb=http://localhost:8086/k6 ./k6/index.js
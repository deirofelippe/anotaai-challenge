app-producer:
	@docker compose exec -it producer ash

logs-producer:
	@docker compose logs -f producer

app-consumer:
	@docker compose exec -it consumer ash

logs-consumer:
	@docker compose logs -f consumer

k6-build:
	@docker container run --rm --name k6 -w /app -v $$(pwd)/scripts-k6/:/app -u $$(id -u):$$(id -g) grafana/xk6:0.11.0 build v0.51.0 --with github.com/szkiba/xk6-faker@v0.3.0

k6-run-bin:
	@./scripts-k6/k6 run --out json=./scripts-k6/metrics.json --out influxdb=http://localhost:8086/k6 ./scripts-k6/index.js
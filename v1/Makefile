app-producer:
	@docker compose exec -it producer ash

app-consumer:
	@docker compose exec -it consumer ash

k6-build:
	@docker container run --rm --name k6 -w /app -v $$(pwd)/scripts-k6:/app -u $$(id -u):$$(id -g) grafana/xk6:0.11.0 build v0.50.0 --with github.com/szkiba/xk6-faker@v0.3.0
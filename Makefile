dck-app:
	@docker compose exec -it app ash
	
dck-init-app:
	@docker container run -it --rm -w /home/node/app -v $$(pwd):/home/node/app node:20.10.0-alpine3.18 ash

dck-clear:
	@docker container rm -f $$(docker container ls -a -q)
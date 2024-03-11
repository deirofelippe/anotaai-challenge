dck-app:
	@docker compose exec -it app ash
	
# dck-init-app:
# 	@docker container run -it --rm -w /home/node/app -v $$(pwd):/home/node/app ./Dockerfile.app ash

dck-init-app:
	@docker container run -it --rm --name app \
		-v $$(pwd):/home/node/app \
		-v $$(printenv HOME)/.zshrc:/home/node/.zshrc \
		-v $$(printenv HOME)/.zsh_history:/home/node/.zsh_history \
		-v $$(printenv HOME)/.antigenrc:/home/node/ \
		-p 3000:3000 deirofelippe/anotaai-challenge:v1 ash

dck-build-app:
	@docker build --no-cache -f ./Dockerfile.app -t deirofelippe/anotaai-challenge:v1 .

dck-clear:
	@docker container rm -f $$(docker container ls -a -q)


# DESAFIO ANOTA AI

## stack da Zenvia

- bancos de dados relacionais e não relacionais, mensageria, servidores on premise e cloud
- Linux, AWS, Kafka, GitLab, Jenkins, Docker, Kubernetes, IaC com Ansible, Terraform e CloudFormation
- stack vaga: node, nest, mysql, mongodb, php, python, docker, k8s, kafka/rabbitmq/sqs, eda/microservicos,

## Funcionamento

- alguém faz um post ou put de categoria ou produto.
- a api recebe, faz a operação no banco de dados e envia uma mensagem na fila
- a api consome a mensagem da fila, busca no banco o catalogo e envia o json para o s3

- categoria ou produto tem id do owner
- post/put de product, tem o id do owner e category, para inserir o produto do owner e na categoria certa
- post/put de category, tem id do owner, cria categoria sem criar produto
- delete product/category do meu catalogo, ou seja, coloca o id do owner e product/category
- pode criar somente produto se a categoria ja estiver criada
- produto e categoria pertence a somente um owner. 2 owner tem msm nome de categoria, mas n compartilha
- get de catalogo, pega o json (s3) de tds os produtos e categorias do owner, nao precisa fazer busca no banco

POST /products
POST /categories
PUT /products
PUT /categories

## Tópicos importantes na avaliação

Knowledge of JavaScript, Node.js, and Express.js.
Proper structure of the application layers.
Handling of outgoing calls.
Effective use of environment variables.
Implementation of unit tests.
Logging mechanisms.
Error handling strategies.
Documentation quality.
Code organization, module separation, readability, and comments.
Commit history.

## Outras stacks

rabbitmq
redis
nginx
docker ou vagrant
k6
new relic


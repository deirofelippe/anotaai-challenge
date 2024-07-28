#

obs
  servicos, rabbitmq, database, docker, k8s
obs (prometheus, grafana, loki, pyroscope, elastic apm)
aws, secret manager/vault, 
cicd (eslint, sonarqube, testes, cypress)
k8s
database per service, api gateway, circuit breaker, rate limit, health check, retry jitter
nginx
swagger
c4model
docs

- k6
  - groups com cada tipo de requisicao
  - cada group tem o fluxo -> cadastrar, login, buscar produto, comprar
  - load test no browser
  - usar docker, sem fzr build, usar browserify para transformar packages em arquivo unico
- cypress
  - custom commands
  - retires
  - boas praticas no site e sobre custom commands
  - fixtures
  - app actions
- gh actions
  - sonarqube
  - cypress headless
  - k6
  - testes de unidade e de integracao
  - seguranca
- observabilidade
- rabbitmq
  - erro na msg, envia p dlx que vai enviar p dlq, se der erro mais 3x, 
  envia pro parking lot, que é um banco de dados que guarda msg
  - tirar msg duplicada

performance e seguranca
c4model, rabbitmq dlq idempotencia, sonarqube, act, observabilidade, k8s, terraform backend, microservices, swagger, apm influxdb

testcontainers, testes unitarios e de integracao, logs, mongodb catalogo na msm collection, eslint

rabbitmq availability
logs e alertas telegram
observabilidade (apm com elastic, grafana com influxdb, prometheus)
error handling
vault / secret manager
k8s
gh actions

MS pra consistencia no banco
banco pra cada MS

nodejs erick wendel: child process, autocannon 0x, graceful, streams, http, promises, yield, generators


recebe owner, valida owner, busca owner products e categories, monta o json, envia pro s3
MS DE SECRET, MS DE ATUALIZAR BANCO OS OUTROS BANCOS
observabilidade
apm k6 influxdb grafana
resiliencia, alta disponibilidade (k8s)

idempotencia no rabbitmq, pode ter várias mensagens do mesmo owner
dead letter queue, se der erro, deve buscar o proximo da fila
msg para consistencia eventual ()

- Validações
- Logs
- Error handling
- Testes
  - Erros
  - Cobrir branches principais
  - Validações
- Documentação
  - Como executar
  - Facilictar execução com scripts
  - C4 Model
- Commits semânticos
- Variáveis de ambiente

## stack

sonarqube eslint
wiremock testcontainers nock k6 cypress
* aws ec2 s3 sqs sns lambda dynamodb cloudwatch
* fila rabbitmq
cache redis
* docker k8s
log apm observabilidade
postgresql
* mongodb
ci/cd github actions act
ansible
terraform localstack
nginx kong
vagrant

## c4 model

mongodb
s3
rabbitmq
producer
consumer
secret manager
replication database worker (se algum dado é alterado, ele insere o dado nos outros bancos)
chamada grpc para

## microservices patterns

- cricuit breaker
- event driven archtecture
- database per service
- saga
  - orquestracao
  - coreografia
- api gateway
- aggregator
- cqrs
- event sourcing
- asynchronous messaging
- backend for frontend
- service registry

## boas praticas e mas praticas

- deploy independente
  - baixo nivel de acoplamento
  - micro servico nao deve depender de outro (se depender, deve ser mesclado)
- banco de dados para cada microservico: se o banco cai, os microservicos ficarao indisponiveis
- microservicos nao deve se comunicar muito para obter poucos dados
  - as vezes a comunicacao pode ser assincrona
- evite nanoservico, microservico com escopo muito pequeno e que entrega pouca informacao
- evite chamadas em cascada
  - significa muitos microservicos e muitas dependencias, verifique se da pra juntar e se da pra usar mensageria


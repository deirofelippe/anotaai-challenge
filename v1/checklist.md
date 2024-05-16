#

recebe owner, valida owner, busca owner products e categories, monta o json, envia pro s3
MS DE SECRET, MS DE ATUALIZAR BANCO OS OUTROS BANCOS
observabilidade
apm k6 influxdb grafana
localstack terraform s3
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

##

organizar o codigo
eslint
k6
observabilidade

##

wiremock
testcontainers
nock
k6
cypress
jest

logs

sonarqube
grafana
jenkins
zabbix

## portifolio

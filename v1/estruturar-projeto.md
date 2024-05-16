# Estruturação

Cache no NGINX
Uso de CDN da Cloudflare

Estudo de caso

- C4 Model
- Explicação de cada decisão arquitetural de microsserviços, padrões, camadas do código
- Explicação da estrutura das pastas
- Explicação sobre rodar testes, deploy, execução
-

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
- Sonarqube, ESLint, CI/CD,
- Teste de carga e informações sobre o resultado
- Porcentagem de cobertura de código

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

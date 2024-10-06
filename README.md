# Anotaai Challenge

Repositório do enunciado teste: https://github.com/githubanotaai/new-test-backend-nodejs

[Acessar o README da V1 (Nodejs, RabbitMQ, MongoDB)](https://github.com/deirofelippe/anotaai-challenge/tree/main/v1)

Exercicio feito para por em prática diversas ferramentas. A ideia seria por mais versões e mudando a stack, como por exemplo: nodejs, python, php, rabbitmq, sqs e sns.

## Versões

### V1

Vídeo da versão 1 sendo usada:

[![Vídeo da versão 1 sendo usada](https://img.youtube.com/vi/1wTzJHnSl2M/0.jpg)](https://www.youtube.com/watch?v=1wTzJHnSl2M)

- **Fila:** RabbitMQ
- **Banco de dados:** MongoDB
- **Backend:** Typescript, Express
- **Armazenamento de arquivo:** AWS S3 e Localstack
- **Observabilidade:** Prometheus e Grafana
- **Teste de Performance:** K6
- **CI/CD:** Act (Github Actions rodado localmente)
- **VM ou Container:** Docker Compose e Kubernetes

### V2 (Não desenvolvido)

- **Fila:** AWS SNS e SQS
- **Banco de dados:** AWS DynamoDB
- **Backend:** Python, Flask
- **Armazenamento de arquivo:** AWS S3
- **Observabilidade:** Prometheus e Grafana
- **Teste de Performance:** Gatling
- **CI/CD:** Act (Github Actions rodado localmente)
- **VM ou Container:** Docker Compose e Kubernetes

## Checklist

- [ ] Teste automatizado cobrir mais partes do código
- [ ] Refatorar o código do producer e consumer
- [ ] Criar alertas com prometheus para sistemas fora do ar
- [ ] Um banco de dados para cada microserviço
- [ ] Padroes: circuit breaker, saga, rate limit, eda, cqrs, event sourcing, database per service, load balancer, api gateway
- [x] Arquitetura em Camadas
- [ ] Variáveis de ambiente
- [ ] Testes de unidade
- [ ] Error handling
- [ ] Documentação: desenho da arquitetura, justificar decisões, descrição de funcionalidades, descrever configurações para obter resiliência/alta disponibilidade/segurança/escalabilidade
- [x] Histórico de commits
- [ ] Boas práticas: SOLID, clean code, object calisthenics, design patterns
- [ ] API Versioning
- [ ] Observabilidade, 4 Golden Signals e Profiling (pyroscope)
- [ ] Ferramentas de qualidade: analise estática de código
    - [ ] Linter
    - [ ] SonarQube
- [ ] Cache (redis)
- [ ] Segurança:
    - [ ] OWSAP
    - [ ] VPS (ssh, firewall)
- [ ] Elasticsearch (Fulltext Searchj)
- [ ] Banco de dados:
    - [ ] Index
    - [ ] Fulltext Serach
    - [ ] Sharding
    - [ ] Replication

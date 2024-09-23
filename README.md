# Anotaai Challenge

Repositório do teste: https://github.com/githubanotaai/new-test-backend-nodejs

Exercicio feito para por em prática as ferramentas:

- RabbitMQ
- MongoDB
- AWS S3 e Localstack
- Prometheus e Grafana
- K6 (Teste de Performance)
- Act (Github Actions rodado localmente)

Pretendo adicionar mais versões do mesmo sistema, mas implementado com outras tecnologias.

## Versões

### V1

- **Fila:** RabbitMQ
- **Banco de dados:** MongoDB
- **Backend:** Typescript, Express
- **Armazenamento de arquivo:** AWS S3 e Localstack
- **Observabilidade:** Prometheus e Grafana
- **Teste de Performance:** K6
- **CI/CD:** Act (Github Actions rodado localmente)

### V2 (Não desenvolvido)

- **Fila:** AWS SNS e SQS
- **Banco de dados:** AWS DynamoDB
- **Backend:** Python, Flask
- **Armazenamento de arquivo:** AWS S3 e Localstack
- **Observabilidade:** Prometheus e Grafana
- **Teste de Performance:** K6
- **CI/CD:** Act (Github Actions rodado localmente)

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


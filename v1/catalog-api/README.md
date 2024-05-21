# Desafio do anotaai

## Pipeline local

- gh extension exec act

## Execute

- make dck-build-app
- docker compose up -d
- make dck-app
- npm ci
- npm run test

## Mongo Express

- localhost:8081
- login: mongo_express
- senha: password

## Rabbitmq

- docker compose exec -it rabbitmq ash
- rabbitmqadmin help subcommands
- rabbitmqadmin -H localhost -u rabbitmq -p password list exchanges
- rabbitmqadmin -H localhost -u rabbitmq -p password declare exchange name=catalog type=topic durable=true internal=false auto_delete=false
- rabbitmqadmin -H localhost -u rabbitmq -p password declare queue name=change durable=true auto_delete=false
- rabbitmqadmin -H localhost -u rabbitmq -p password declare binding source=catalog destination=change routing_key=catalog.change.\*
- rabbitmqadmin -H localhost -u rabbitmq -p password publish exchange=catalog routing_key=catalog.change.teste payload='{ "owner": "1" }'
- rabbitmqadmin -H localhost -u rabbitmq -p password get queue=change ackmode=ack_requeue_true
  - ack_requeue_true - the messages will be flagged as acknowledged, the messages remain in the queue
  - reject_requeue_true - the messages will be flagged as rejected, the messages remain in the queue
  - ack_requeue_false - the messages will be flagged as acknowledged, the messages will be dropped
  - reject_requeue_false - the messages will be flagged as rejected, the messages will be dropped


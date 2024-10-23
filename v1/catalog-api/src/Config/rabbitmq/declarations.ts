import Connection, { Publisher } from 'rabbitmq-client';
import { RabbitMQSingleton } from '../RabbitMQSingleton';

export async function declareExchangeAndQueue(
  rabbitmqConnection: Connection
): Promise<Publisher> {
  await rabbitmqConnection.exchangeDeclare({
    exchange: 'change-dlx',
    type: 'direct',
    durable: true,
    autoDelete: false
  });
  await rabbitmqConnection.queueDeclare({
    queue: 'change-dlq',
    arguments: { 'x-queue-type': 'classic' },
    durable: true,
    autoDelete: false
  });
  await rabbitmqConnection.queueBind({
    exchange: 'change-dlx',
    queue: 'change-dlq',
    routingKey: 'key-change-dlx'
  });

  await rabbitmqConnection.exchangeDeclare({
    exchange: 'catalog',
    type: 'topic',
    durable: true,
    autoDelete: false
  });
  await rabbitmqConnection.queueDeclare({
    queue: 'change',
    arguments: {
      'x-queue-type': 'classic',
      'x-dead-letter-exchange': 'change-dlx',
      'x-dead-letter-routing-key': 'key-change-dlx'
    },
    durable: true,
    autoDelete: false
  });
  await rabbitmqConnection.queueBind({
    exchange: 'catalog',
    queue: 'change',
    routingKey: 'catalog.change.*'
  });

  const publisher = rabbitmqConnection.createPublisher({
    confirm: true,
    maxAttempts: 1,
    exchanges: [
      { exchange: 'catalog', type: 'topic', durable: true, autoDelete: false }
    ],
    queues: [
      {
        queue: 'change',
        arguments: {
          'x-queue-type': 'classic',
          'x-dead-letter-exchange': 'change-dlx',
          'x-dead-letter-routing-key': 'key-change-dlx'
        },
        durable: true,
        autoDelete: false
      }
    ]
  });

  return publisher;
}

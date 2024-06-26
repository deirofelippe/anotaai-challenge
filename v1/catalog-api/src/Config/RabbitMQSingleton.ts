import { rabbitUsername, rabbitPassword, rabbitHost, rabbitPort } from './env';
import { Connection, Consumer, Publisher } from 'rabbitmq-client';

export class RabbitMQSingleton {
  private static connection?: Connection = undefined;
  private static publisher?: Publisher = undefined;
  private static consumer?: Consumer = undefined;

  private constructor() {}

  public static getInstance() {
    if (!RabbitMQSingleton.connection) {
      throw new Error('A conexão com o RabbitMQ não foi aberta.');
    }

    return RabbitMQSingleton.connection;
  }

  public static getPublisher() {
    if (!RabbitMQSingleton.connection) {
      throw new Error('A conexão com o RabbitMQ não foi aberta.');
    }

    return RabbitMQSingleton.publisher;
  }

  public static async connect() {
    if (RabbitMQSingleton.connection) {
      return this;
    }

    const url = `amqp://${rabbitUsername}:${rabbitPassword}@${rabbitHost}:${rabbitPort}`;

    const rabbitmq = new Connection(url);

    rabbitmq.on('error', (err) => {
      console.log('RabbitMQ connection error', err);
    });
    rabbitmq.on('connection', () => {
      console.log('RabbitMQ connection successfully');
    });
    RabbitMQSingleton.connection = rabbitmq;

    await this.declareExchangeAndQueue();

    return this;
  }

  private static async declareExchangeAndQueue() {
    const rabbitmq = RabbitMQSingleton.connection!;

    await rabbitmq.exchangeDeclare({
      exchange: 'catalog',
      type: 'topic',
      durable: true,
      autoDelete: false
    });

    await rabbitmq.queueDeclare({
      queue: 'change',
      arguments: { 'x-queue-type': 'classic' },
      durable: true,
      autoDelete: false
    });

    await rabbitmq.queueBind({
      exchange: 'catalog',
      queue: 'change',
      routingKey: 'catalog.change.*'
    });

    const publisher = rabbitmq.createPublisher({
      confirm: true,
      maxAttempts: 1,
      exchanges: [
        { exchange: 'catalog', type: 'topic', durable: true, autoDelete: false }
      ],
      queues: [{ queue: 'change', durable: true, autoDelete: false }]
    });
    RabbitMQSingleton.publisher = publisher;
  }

  public static async close() {
    if (!RabbitMQSingleton.connection) {
      return;
    }

    console.log('Fechando publisher...');
    await RabbitMQSingleton.publisher?.close();
    console.log('Fechando consumer...');
    await RabbitMQSingleton.consumer?.close();
    console.log('Fechando connection...');
    await RabbitMQSingleton.connection?.close();
  }
}

import { rabbitUsername, rabbitPassword, rabbitHost, rabbitPort } from './env';
import { Connection, Consumer, Publisher } from 'rabbitmq-client';

export class RabbitMQInstance {
  private static connection?: Connection = undefined;
  private static publisher?: Publisher = undefined;
  private static consumer?: Consumer = undefined;

  private constructor() {}

  public static getInstance() {
    if (!RabbitMQInstance.connection) {
      throw new Error('A conexão com o RabbitMQ não foi aberta.');
    }

    return RabbitMQInstance.connection;
  }

  public static getPublisher() {
    if (!RabbitMQInstance.connection) {
      throw new Error('A conexão com o RabbitMQ não foi aberta.');
    }

    return RabbitMQInstance.publisher;
  }

  public static async connect() {
    if (RabbitMQInstance.connection) {
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
    RabbitMQInstance.connection = rabbitmq;

    await this.declareExchangeAndQueue();

    return this;
  }

  private static async declareExchangeAndQueue() {
    const rabbitmq = RabbitMQInstance.connection!;

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
    RabbitMQInstance.publisher = publisher;
  }

  public static async close() {
    if (!RabbitMQInstance.connection) {
      return;
    }

    console.log('Fechando publisher...');
    await RabbitMQInstance.publisher?.close();
    console.log('Fechando consumer...');
    await RabbitMQInstance.consumer?.close();
    console.log('Fechando connection...');
    await RabbitMQInstance.connection?.close();
  }
}

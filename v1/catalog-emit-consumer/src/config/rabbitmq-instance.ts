import { CatalogRepository } from './CatalogRepository';
import { CompileCatalogController } from './CompileCatalogController';
import { CompileCatalogUsecase } from './CompileCatalogUsecase';
import { rabbitUsername, rabbitPassword, rabbitHost, rabbitPort } from './env';
import {
  Connection,
  Consumer,
  ConsumerHandler,
  ConsumerProps,
  ConsumerStatus,
  Publisher
} from 'rabbitmq-client';
import { logger } from './logger';

export class RabbitMQInstance {
  private static connection?: Connection = undefined;
  private static publisher?: Publisher = undefined;
  private static consumer?: Consumer = undefined;

  private constructor() {}

  public static getInstance() {
    if (!RabbitMQInstance.connection) {
      logger.error({
        context: 'rabbitmq',
        data: 'A conexão com o RabbitMQ não foi aberta.'
      });
      throw new Error('A conexão com o RabbitMQ não foi aberta.');
    }

    return RabbitMQInstance.connection;
  }

  public static getPublisher() {
    if (!RabbitMQInstance.connection) {
      logger.error({
        context: 'rabbitmq',
        data: 'A conexão com o RabbitMQ não foi aberta.'
      });
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
      logger.debug({
        context: 'rabbitmq',
        data: { description: 'RabbitMQ connection error', error: err }
      });
    });
    rabbitmq.on('connection', () => {
      logger.debug({
        context: 'rabbitmq',
        data: 'RabbitMQ connection successfully'
      });
    });
    RabbitMQInstance.connection = rabbitmq;

    await this.declareExchangeAndQueue();
    await this.createConsumer();

    return this;
  }

  private static async declareExchangeAndQueue() {
    const rabbitmq = RabbitMQInstance.connection!;

    await rabbitmq.exchangeDeclare({
      exchange: 'change-dlx',
      type: 'direct',
      durable: true,
      autoDelete: false
    });
    await rabbitmq.queueDeclare({
      queue: 'change-dlq',
      arguments: { 'x-queue-type': 'classic' },
      durable: true,
      autoDelete: false
    });
    await rabbitmq.queueBind({
      exchange: 'change-dlx',
      queue: 'change-dlq',
      routingKey: 'key-change-dlx'
    });

    await rabbitmq.exchangeDeclare({
      exchange: 'catalog',
      type: 'topic',
      durable: true,
      autoDelete: false
    });
    await rabbitmq.queueDeclare({
      queue: 'change',
      arguments: {
        'x-queue-type': 'classic',
        'x-dead-letter-exchange': 'change-dlx',
        'x-dead-letter-routing-key': 'key-change-dlx'
      },
      durable: true,
      autoDelete: false
    });
    await rabbitmq.queueBind({
      exchange: 'catalog',
      queue: 'change',
      routingKey: 'catalog.change.*'
    });
  }

  public static async createConsumer() {
    const rabbitmq = RabbitMQInstance.connection!;
    const compileCatalogController = new CompileCatalogController(
      new CompileCatalogUsecase(new CatalogRepository())
    );

    const props: ConsumerProps = {
      queue: 'change',
      queueOptions: {
        queue: 'change',
        arguments: {
          'x-queue-type': 'classic',
          'x-dead-letter-exchange': 'change-dlx',
          'x-dead-letter-routing-key': 'key-change-dlx'
        },
        durable: true,
        autoDelete: false
      },
      exchanges: [
        {
          exchange: 'catalog',
          type: 'topic',
          autoDelete: false,
          durable: true
        }
      ],
      qos: { prefetchCount: 1 }
    };

    const consumer = rabbitmq.createConsumer(
      props,
      compileCatalogController.execute.bind(compileCatalogController)
    );
    RabbitMQInstance.consumer = consumer;
  }

  public static async close() {
    if (!RabbitMQInstance.connection) {
      return;
    }

    logger.debug({
      context: 'rabbitmq',
      data: 'Fechando publisher...'
    });
    await RabbitMQInstance.publisher?.close();
    logger.debug({
      context: 'rabbitmq',
      data: 'Fechando consumer...'
    });
    await RabbitMQInstance.consumer?.close();
    logger.debug({
      context: 'rabbitmq',
      data: 'Fechando connection...'
    });
    await RabbitMQInstance.connection?.close();
  }
}

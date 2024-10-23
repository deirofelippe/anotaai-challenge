import { rabbitUsername, rabbitPassword, rabbitHost, rabbitPort } from './env';
import { Connection, Consumer, Publisher } from 'rabbitmq-client';
import { declareExchangeAndQueue } from './rabbitmq/declarations';
import { logger } from './logger';

export class RabbitMQSingleton {
  private static connection?: Connection = undefined;
  private static publisher?: Publisher = undefined;
  private static consumer?: Consumer = undefined;

  private constructor() {}

  public static getInstance() {
    if (!RabbitMQSingleton.connection) {
      logger.error({
        context: 'rabbitmq',
        data: 'A conexão com o RabbitMQ não foi aberta.'
      });
      throw new Error('A conexão com o RabbitMQ não foi aberta.');
    }

    return RabbitMQSingleton.connection;
  }

  public static getPublisher() {
    if (!RabbitMQSingleton.connection) {
      logger.error({
        context: 'rabbitmq',
        data: 'A conexão com o RabbitMQ não foi aberta.'
      });
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
    RabbitMQSingleton.connection = rabbitmq;

    const publisher = await declareExchangeAndQueue(
      RabbitMQSingleton.connection!
    );

    RabbitMQSingleton.publisher = publisher;

    return this;
  }

  public static async close() {
    if (!RabbitMQSingleton.connection) {
      return;
    }

    logger.debug({
      context: 'rabbitmq',
      data: 'Fechando publisher...'
    });
    await RabbitMQSingleton.publisher?.close();
    logger.debug({
      context: 'rabbitmq',
      data: 'Fechando consumer...'
    });
    await RabbitMQSingleton.consumer?.close();
    logger.debug({
      context: 'rabbitmq',
      data: 'Fechando connection...'
    });
    await RabbitMQSingleton.connection?.close();
  }
}

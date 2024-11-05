import { rabbitUsername, rabbitPassword, rabbitHost, rabbitPort } from '../env';
import { Connection, Consumer, Publisher } from 'rabbitmq-client';
import { logger } from './logger';
import { declareExchangeAndQueue } from './rabbitmq/declarations';
import { createConsumer } from './rabbitmq/create-consumer';

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

    await declareExchangeAndQueue(rabbitmq);
    const consumer = await createConsumer(rabbitmq);

    RabbitMQInstance.consumer = consumer;

    return this;
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

import { logger } from '../Config/Logger';
import { RabbitMQSingleton } from '../Config/RabbitMQSingleton';

export type NewRecordedDataQueueInput = { owner: string };

export class NewRecordedDataQueue {
  public async sendMessage(input: NewRecordedDataQueueInput) {
    logger.info({
      context: 'repository',
      data: 'Iniciando o NewRecordedDataQueue.sendMessage'
    });
    logger.info({
      context: 'repository',
      data: { input }
    });
    const publisher = RabbitMQSingleton.getPublisher()!;

    try {
      await publisher.send(
        {
          contentType: 'application/json',
          exchange: 'catalog',
          routingKey: 'catalog.change.teste',
          messageId: 'owner-' + input.owner,
          durable: true
        },
        input
      );

      logger.info({
        context: 'repository',
        data: 'Finalizando o NewRecordedDataQueue.sendMessage'
      });
    } catch (error) {
      logger.error({
        context: 'repository',
        data: 'Erro no NewRecordedDataQueue.sendMessage'
      });
      logger.error({ context: 'repository', data: error });
      throw error;
    }
  }
}

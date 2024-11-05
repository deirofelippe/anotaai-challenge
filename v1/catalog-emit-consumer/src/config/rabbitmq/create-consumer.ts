import Connection, { Consumer, ConsumerProps } from 'rabbitmq-client';
import { CompileCatalogController } from '../../CompileCatalogController';
import { CompileCatalogUsecase } from '../../CompileCatalogUsecase';
import { CatalogRepository } from '../../CatalogRepository';

export async function createConsumer(
  rabbitmqConnection: Connection
): Promise<Consumer> {
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

  const consumer = rabbitmqConnection.createConsumer(
    props,
    compileCatalogController.execute.bind(compileCatalogController)
  );

  return consumer;
}

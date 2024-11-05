import Connection, { Consumer, ConsumerProps } from 'rabbitmq-client';
import { CompileCatalogController } from '../../compile-catalog-controller';
import { CompileCatalogUsecase } from '../../compile-catalog-usecase';
import { CatalogRepository } from '../../catalog-repository';
import { CatalogS3 } from '../../catalog-s3';

export async function createConsumer(
  rabbitmqConnection: Connection
): Promise<Consumer> {
  const compileCatalogController = new CompileCatalogController(
    new CompileCatalogUsecase(new CatalogRepository(), new CatalogS3())
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

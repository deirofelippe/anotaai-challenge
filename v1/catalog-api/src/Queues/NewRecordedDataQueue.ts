import { RabbitMQSingleton } from '../Config/RabbitMQSingleton';

export type NewRecordedDataQueueInput = { owner: string };

export class NewRecordedDataQueue {
  public async sendMessage(input: NewRecordedDataQueueInput) {
    const publisher = RabbitMQSingleton.getPublisher()!;

    try {
      await publisher.send(
        {
          exchange: 'catalog',
          routingKey: 'catalog.change.teste',
          durable: true
        },
        input
      );
      return;
    } catch (error) {
      console.error('Erro ao envia mensagem para a fila');
      console.error('Dados: ', JSON.stringify(input));
      throw error;
    }
  }
}

import { RabbitMQSingleton } from '../Config/RabbitMQSingleton';

export type NewRecordedDataQueueInput = { owner: string };

export class NewRecordedDataQueue {
  public async sendMessage(input: NewRecordedDataQueueInput) {
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
      return;
    } catch (error) {
      console.error('Erro ao envia mensagem para a fila');
      console.error('Dados: ', JSON.stringify(input));
      throw error;
    }
  }
}

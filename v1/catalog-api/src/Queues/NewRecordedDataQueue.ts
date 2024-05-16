import { RabbitMQInstance } from '../RabbitMQInstance';

export type NewRecordedDataQueueInput = { owner: string };

export class NewRecordedDataQueue {
  public async sendMessage(input: NewRecordedDataQueueInput) {
    const publisher = RabbitMQInstance.getPublisher()!;

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

import { MongoInstance } from './MongoInstance';
import { RabbitMQInstance } from './RabbitMQInstance';

RabbitMQInstance.connect().then(() => {});
MongoInstance.connect().then(() => {});

const onShutdown =
  (input: { exitCode: number; signalCode: string }) =>
  async (arg1: any, arg2: any) => {
    console.log(`Finalizando o processo com o código ${input.signalCode}`);

    if (input.signalCode === 'uncaughtException') {
      console.log(arg1);
    }

    if (input.signalCode === 'unhandledRejection') {
      console.log(arg1);
      console.log(arg2);
    }

    await RabbitMQInstance.close();
    await MongoInstance.close();

    process.exit(input.exitCode);
  };

process.on('SIGINT', onShutdown({ exitCode: 0, signalCode: 'SIGINT' }));
process.on('SIGTERM', onShutdown({ exitCode: 0, signalCode: 'SIGTERM' }));
process.on(
  'uncaughtException',
  onShutdown({ exitCode: 1, signalCode: 'uncaughtException' })
);

process.on(
  'unhandledRejection',
  onShutdown({ exitCode: 1, signalCode: 'unhandledRejection' })
);

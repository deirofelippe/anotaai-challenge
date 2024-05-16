import express from 'express';
import { MongoInstance } from './MongoInstance';
import { RabbitMQInstance } from './RabbitMQInstance';
import { errorHandling } from './errorHandling';
import { apiRoutes } from './routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandling);
app.use(apiRoutes);

const server = app.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});

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

    server.close(() => {
      console.log('Express connection closed');
    });

    process.exit(input.exitCode);
  };

process.on('SIGINT', onShutdown({ exitCode: 0, signalCode: 'SIGINT' }));
process.on('SIGTERM', onShutdown({ exitCode: 0, signalCode: 'SIGTERM' }));
process.on(
  'uncaughtException',
  onShutdown({ exitCode: 1, signalCode: 'uncaughtException' })
);
//
process.on(
  'unhandledRejection',
  onShutdown({ exitCode: 1, signalCode: 'unhandledRejection' })
);

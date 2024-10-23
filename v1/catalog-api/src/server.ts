import express from 'express';
import { errorHandling } from './errorHandling';
import { indexRoutes } from './Routes/routes';
import { categoryRoutes } from './Routes/categories.routes';
import { productRoutes } from './Routes/products.routes';
import { RabbitMQSingleton } from './Config/RabbitMQSingleton';
import { MongoDBSingleton } from './Config/MongoDBSingleton';
import { metricsRegisterRequestInfo } from './middlewares/metricsRegisterRequestInfoMiddleware';
import { metricsRegisterResponseTime } from './middlewares/metricsRegisterResponseTimeMiddleware';

const app = express();
const port = 3000;

app.use(metricsRegisterResponseTime());
app.use(metricsRegisterRequestInfo);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandling);

app.use(indexRoutes);
app.use(categoryRoutes);
app.use(productRoutes);

const server = app.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});

RabbitMQSingleton.connect().then(() => {});
MongoDBSingleton.connect().then(() => {});

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

    await RabbitMQSingleton.close();
    await MongoDBSingleton.close();

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

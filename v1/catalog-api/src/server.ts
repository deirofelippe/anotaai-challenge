import express from 'express';
import { errorHandling } from './errorHandling';
import { indexRoutes } from './Routes/routes';
import { categoryRoutes } from './Routes/categories.routes';
import { productRoutes } from './Routes/products.routes';
import { RabbitMQSingleton } from './Config/RabbitMQSingleton';
import { MongoDBSingleton } from './Config/MongoDBSingleton';
import responseTime from 'response-time';

import {
  Counter,
  Histogram,
  collectDefaultMetrics,
  Registry
} from 'prom-client';
const register = new Registry();
collectDefaultMetrics({ register });

const app = express();
const port = 3000;

const histogram = new Histogram({
  registers: [register],
  name: 'producer_response_time',
  help: 'Tempo de resposta',
  labelNames: ['path', 'method'],
  buckets: [
    1, 5, 10, 25, 50, 100, 150, 200, 300, 400, 500, 600, 1_000, 3_000, 7_000,
    10_000, 20_000, 50_000
  ]
});

const counter = new Counter({
  registers: [register],
  name: 'producer_request_info',
  help: 'Conta a quantidade do method, path e status_code',
  labelNames: ['method', 'path', 'status_code']
});

const counterTotalRequests = new Counter({
  registers: [register],
  name: 'producer_request_total',
  help: 'Conta a quantidade de requisições feitas'
});

function pathAndMethodIsDisabledToMetric(path: string, method: string) {
  const disabledPaths = ['/', '/metrics'];
  const enabledMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  const pathIsDisabled = disabledPaths.some(
    (disabledPath) => path === disabledPath
  );
  const methodIsDisabled = !enabledMethods.includes(method);

  return pathIsDisabled || methodIsDisabled;
}

function getStatusCodePattern(statusCode: number) {
  if (`${statusCode}`.startsWith('2')) {
    return '2XX';
  }

  if (`${statusCode}`.startsWith('3')) {
    return '3XX';
  }

  if (`${statusCode}`.startsWith('4')) {
    return '4XX';
  }

  if (`${statusCode}`.startsWith('5')) {
    return '5XX';
  }

  return '';
}

app.use(
  responseTime(function (req, res, time) {
    const method = req.method!;
    const path = req.url!;

    if (pathAndMethodIsDisabledToMetric(path, method)) {
      return;
    }

    console.log(time + 'ms');

    try {
      histogram.observe({ path, method }, time);
    } catch (error) {
      console.log(error);
    }
  })
);

app.use(function (req, res, next) {
  // counterTotalRequests.inc();

  next();

  const method = req.method!;
  const path = req.url;
  const statusCode = res.statusCode!;

  const statusCodePattern = getStatusCodePattern(statusCode);
  const statusCodeIsWrong = statusCodePattern === '';

  if (statusCodeIsWrong || pathAndMethodIsDisabledToMetric(path, method)) {
    return;
  }

  counter.inc({
    method,
    path,
    status_code: statusCodePattern
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandling);

app.use(indexRoutes);
app.use(categoryRoutes);
app.use(productRoutes);

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

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

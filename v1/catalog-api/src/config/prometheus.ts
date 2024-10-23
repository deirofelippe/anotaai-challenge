import {
  Counter,
  Histogram,
  collectDefaultMetrics,
  Registry
} from 'prom-client';

export const register = new Registry();
collectDefaultMetrics({ register });

export const responseTimeHistogram = new Histogram({
  registers: [register],
  name: 'producer_response_time',
  help: 'Tempo de resposta',
  labelNames: ['path', 'method'],
  buckets: [
    1, 5, 10, 25, 50, 100, 150, 200, 300, 400, 500, 600, 1_000, 3_000, 7_000,
    10_000, 20_000, 50_000
  ]
});

export const requestInfoCounter = new Counter({
  registers: [register],
  name: 'producer_request_info',
  help: 'Conta a quantidade do method, path e status_code',
  labelNames: ['method', 'path', 'status_code']
});

export function pathAndMethodIsDisabledToMetric(path: string, method: string) {
  const disabledPaths = ['/', '/metrics'];
  const enabledMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  const pathIsDisabled = disabledPaths.some(
    (disabledPath) => path === disabledPath
  );
  const methodIsDisabled = !enabledMethods.includes(method);

  return pathIsDisabled || methodIsDisabled;
}

export function getStatusCodePattern(statusCode: number) {
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

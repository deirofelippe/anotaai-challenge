import responseTime from 'response-time';
import {
  pathAndMethodIsDisabledToMetric,
  responseTimeHistogram
} from '../Config/prometheus';
import { logger } from '../Config/Logger';

export const metricsRegisterResponseTime = () =>
  responseTime(function (req, res, time) {
    const method = req.method!;
    const path = req.url!;

    if (pathAndMethodIsDisabledToMetric(path, method)) {
      return;
    }

    try {
      responseTimeHistogram.observe({ path, method }, time);
    } catch (error) {
      logger.error({
        context: 'middleware',
        data: 'Erro ao registrar a métrica no prometheus'
      });
      logger.error({ context: 'middleware', data: error });
    }
  });

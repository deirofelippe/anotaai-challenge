import { NextFunction, Request, Response } from 'express';
import {
  getStatusCodePattern,
  pathAndMethodIsDisabledToMetric,
  requestInfoCounter
} from '../Config/prometheus';

export function metricsRegisterRequestInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();

  const method = req.method!;
  const path = req.url;
  const statusCode = res.statusCode!;

  const statusCodePattern = getStatusCodePattern(statusCode);
  const statusCodeIsWrong = statusCodePattern === '';

  if (statusCodeIsWrong || pathAndMethodIsDisabledToMetric(path, method)) {
    return;
  }

  requestInfoCounter.inc({
    method,
    path,
    status_code: statusCodePattern
  });
}

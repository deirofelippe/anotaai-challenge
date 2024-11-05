import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { disableLogs, logLevel } from './env';
import { DateTime } from 'luxon';

export const log = (obj: any) => {
  if (typeof obj === 'object') {
    console.log(JSON.stringify(obj, null, '  '));
    return;
  }
  console.log(obj);
};

function selectLogLevel() {
  let selectedLogLevel = logLevel;

  const levels = ['critical', 'error', 'warning', 'info', 'debug'];
  const logLevelIsNotValid = !levels.includes(
    selectedLogLevel.toLocaleLowerCase()
  );

  if (logLevelIsNotValid) {
    selectedLogLevel = 'info';
  }

  return selectedLogLevel;
}

const winstonLogger = winston.createLogger({
  levels: {
    critical: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4
  },
  level: selectLogLevel(),
  format: winston.format.json(),
  transports: [
    new DailyRotateFile({
      filename: `./logs/producer-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '7d'
    })
  ]
});

if (logLevel === 'debug') {
  winstonLogger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

type LogOpts = {
  data: any;
  context: string;
};

function buildLogData(opts: LogOpts) {
  const now = DateTime.now()
    .setLocale('pt-BR')
    .setZone('America/Sao_Paulo')
    .toFormat('yyyy-LL-dd HH:mm:ss');

  return {
    datetime: now,
    context: opts.context.toLocaleLowerCase(),
    message: opts.data
  };
}

function critical(opts: LogOpts) {
  if (disableLogs) return;

  winstonLogger.crit(buildLogData(opts));
}

function error(opts: LogOpts) {
  if (disableLogs) return;

  winstonLogger.error(buildLogData(opts));
}

function info(opts: LogOpts) {
  if (disableLogs) return;

  winstonLogger.info(buildLogData(opts));
}

function warning(opts: LogOpts) {
  if (disableLogs) return;

  winstonLogger.warning(buildLogData(opts));
}

function debug(opts: LogOpts) {
  if (disableLogs) return;

  winstonLogger.debug(buildLogData(opts));
}

const logger = {
  info,
  debug,
  critical,
  warning,
  error
};

export { logger };

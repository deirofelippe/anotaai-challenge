import 'dotenv/config';

const nodeEnv: string = process.env.NODE_ENV!;

const isTesting = ['test', 'testing'].includes(nodeEnv);
const isDevelopment = ['dev', 'development'].includes(nodeEnv);
const isProduction = ['prod', 'production'].includes(nodeEnv);
const isCI = process.env.CI === 'true';

const disableLogs = process.env.DISABLE_LOGS === undefined ? false : true;
const logLevel = process.env.LOG_LEVEL?.toLowerCase() ?? 'info';

let mongoHost = process.env.MONGODB_HOST;
const mongoUser = process.env.MONGODB_USER;
const mongoPassword = process.env.MONGODB_PASSWORD;
let mongoDatabase = process.env.MONGODB_DATABASE;
let mongoPort = process.env.MONGODB_PORT;

if (isTesting) {
  mongoDatabase = mongoDatabase + '_test';
}

let rabbitHost = process.env.RABBITMQ_HOST;
const rabbitPort = process.env.RABBITMQ_PORT;
const rabbitUsername = process.env.RABBITMQ_USERNAME;
const rabbitPassword = process.env.RABBITMQ_PASSWORD;

if (isCI) {
  mongoHost = process.env.MONGODB_HOST_CI;
  mongoPort = process.env.MONGODB_PORT_CI;
  rabbitHost = process.env.RABBITMQ_HOST_CI;
}

export {
  disableLogs,
  logLevel,
  nodeEnv,
  isTesting,
  isProduction,
  mongoHost,
  mongoPort,
  mongoDatabase,
  mongoUser,
  mongoPassword,
  rabbitUsername,
  rabbitPassword,
  rabbitHost,
  rabbitPort
};

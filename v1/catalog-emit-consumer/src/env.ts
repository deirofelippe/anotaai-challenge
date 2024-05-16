import 'dotenv/config';

const nodeEnv: string = process.env.NODE_ENV!;

const isTesting = ['test', 'testing'].includes(nodeEnv);
const isProduction = ['prod', 'production'].includes(nodeEnv);

const mongoHost = process.env.MONGODB_HOST;
const mongoUser = process.env.MONGODB_USER;
const mongoPassword = process.env.MONGODB_PASSWORD;
let mongoDatabase = process.env.MONGODB_DATABASE;
const mongoPort = process.env.MONGODB_PORT;

if (isTesting) {
  mongoDatabase = mongoDatabase + '_test';
}

const rabbitUsername = process.env.RABBITMQ_USERNAME;
const rabbitPassword = process.env.RABBITMQ_PASSWORD;
const rabbitHost = process.env.RABBITMQ_HOST;
const rabbitPort = process.env.RABBITMQ_PORT;

export {
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

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

export {
  nodeEnv,
  isTesting,
  isProduction,
  mongoHost,
  mongoPort,
  mongoDatabase,
  mongoUser,
  mongoPassword
};

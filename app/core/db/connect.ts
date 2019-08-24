import Mongoose from 'mongoose';

import * as config from '../config';

import logger from '../logger';
import { DB_CONNECTION_SUCCESS } from '../utils/constants';

Mongoose.Promise = global.Promise;

/**
 * Create the connection to the database
 * @async
 *
 * @return Promise<void>
 */
const dbConnection = async (): Promise<void> => {
  const dbHost = config.DB_HOST;
  const dbPort = config.DB_PORT;
  const dbName = config.DB_NAME;
  const dbUser = config.DB_USER;
  const dbPassword = config.DB_PASSWORD;

  const options = { useNewUrlParser: true , useFindAndModify: false, useCreateIndex: true };
  try {
    if (config.DB_AUTH !== 'true') {
      await Mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, options);
    } else {
      await Mongoose.connect(`mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`, options);
    }
    logger.info(DB_CONNECTION_SUCCESS);
  } catch (err) {
    logger.error(err.stack);
  }
};

export default dbConnection;

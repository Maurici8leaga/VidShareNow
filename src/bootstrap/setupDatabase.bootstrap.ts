import mongoose from 'mongoose';
import Logger from 'bunyan';
import { logger } from '@configs/configLogs';
import { config } from '@configs/configEnv';

const log: Logger = logger.createLogger('Database');

// In this component was implemented Design Pattern Singleton
export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info('Connected to Database successfully');
      })
      .catch(error => {
        log.error('Error connecting to database', error);

        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};

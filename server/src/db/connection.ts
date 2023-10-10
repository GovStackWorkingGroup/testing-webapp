import mongoose from 'mongoose';
import { Config } from '../../@types/shared/commonInterfaces';

/* eslint-disable no-console */
export const createConnection = (config: Config) => {
  function connectToMongo() {
    mongoose
      .connect(config.mongoConnection.uri)
      .then(
        () => { },
        (err) => {
          console.error('Connection error: ', err);
        },
      )
      .catch((err) => {
        console.error('ERROR:', err);
      });
  }

  mongoose.connection.on('disconnected', () => {
    console.error('Mongo disconnected, reconnecting...');
    setTimeout(() => connectToMongo(), config.mongoConnection.reconnectInterval);
  });

  return {
    connectToMongo,
  };
};

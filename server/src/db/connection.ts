/// <reference path="../../@types/shared/commonInterfaces.d.ts" />

import mongoose from 'mongoose';

/* eslint-disable no-console */
export const createConnection = (config: CommonTypes.Config) => {
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

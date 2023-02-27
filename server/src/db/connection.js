const mongoose = require('mongoose');

/* eslint-disable no-console */
module.exports = {
  connection: (config) => {
    function connectToMongo() {
      mongoose
        .connect(config.mongoConnection.uri)
        .then(
          () => {},
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
  },
};

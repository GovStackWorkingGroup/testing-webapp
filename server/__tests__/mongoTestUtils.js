// mongoTestUtils.js

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const mongod = new MongoMemoryServer();

const connect = async () => {
  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

module.exports = { connect, closeDatabase };

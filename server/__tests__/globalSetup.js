const app = require('../server');
const { startDB, closeDB } = require('./mongoTestUtils');

before(async () => {
  const mongoUri = await startDB();
  const testAppConfig = {
    appName: process.env.appName ? process.env.appName : 'testing-webapp-api',
    isProduction: process.env.envName ? process.env.envName === 'prod' : false,
    mongoConnection: { uri: mongoUri },
  };
  await app(testAppConfig); // Start your app with the in-memory database
});

after(async () => {
  await closeDB();
});

const Client = require('./lib/index');
const tests = require('./commandTests.js');

require('dotenv').config();

const client = new Client();

client.login(process.env.TEST_BOT_TOKEN)
  .then(() => {
    tests.forEach(async (test) => {
      const response = await client.getResponse(test[0], test[1]);
      if (!response) {
        throw new Error(`Error while testing on ${test[0]} test.`);
      }
    });
  })
  .catch(console.error);

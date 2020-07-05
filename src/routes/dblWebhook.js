const express = require('express');

class MainRoute {
  constructor(client) {
    this.client = client;
  }

  init() {
    // Require express and body-parser
    // eslint-disable-next-line global-require
    const bodyParser = require('body-parser');

    // Initialize express and define a port
    const app = express();
    const PORT = 3292;

    // Tell express to use body-parser's JSON parsing
    app.use(bodyParser.json());

    // Start express on the defined port
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    // DBL webhooks
    app.post('/', async (req, res) => {
      if (req.headers.authorization) {
        if (req.headers.authorization === '0ef46961-03c6-493a-9eee-c0d13ec07269') {
          // eslint-disable-next-line no-use-before-define
          await this.client.emit('dblWebhook', req.body);
          res.send({ status: 200 });
        } else {
          console.log('auth error');
          res.send({ status: 401, error: 'The auth received does not match the one in your config file.' });
        }
      } else {
        res.send({ status: 403, error: 'There was no auth header in the webhook' });
      }
    });
  }
}
module.exports = MainRoute;

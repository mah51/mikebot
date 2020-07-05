const express = require('express');

class MainRoute {
  constructor(client) {
    this.client = client;
  }

  init() {
    const app = express();

    app.use(express.json({ extended: false }));

    // DBL webhooks
    app.post('/dblwebhook', async (req, res) => {
      if (req.headers.authorization) {
        if (req.headers.authorization === '0ef46961-03c6-493a-9eee-c0d13ec07269') {
          // eslint-disable-next-line no-use-before-define
          await this.client.emit('dblWebhook', req.data);
          res.send({ status: 200 });
        } else {
          console.log('auth error');
          res.send({ status: 401, error: 'The auth received does not match the one in your config file.' });
        }
      } else {
        res.send({ status: 403, error: 'There was no auth header in the webhook' });
      }
    });

    // Launches the webserver on port 80
    function launchServer() {
      // eslint-disable-next-line global-require
      const http = require('http');
      http.createServer(app).listen(3292);
      console.log(`Server started on port 3292 pid: ${process.pid}`);
    }

    launchServer();
  }
}
module.exports = MainRoute;

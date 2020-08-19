const express = require('express');
const chalk = require('chalk');
const cors = require('cors');
const { webHook, statFunc } = require('./routes');

class MainRoute {
  constructor(client) {
    this.client = client;
  }

  init() {
    const app = express();
    app.use(cors());

    app.post('/', async (req, res) => {
      await webHook(req, res, this.client);
    });

    app.get('/stats', async (req, res) => {
      await statFunc(req, res, this.client);
    });

    app.listen(process.env.PORT, () => this.client.logger.info(`Express server listening on port ${chalk.bold.blue(process.env.PORT)}`));
  }
}
module.exports.MainRoute = MainRoute;
